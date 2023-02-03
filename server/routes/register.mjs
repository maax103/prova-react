import { Sequelize } from "sequelize";
import { sequelizeOpts } from "../db/db_utils.mjs";
import { UserSchema } from "../db/schemas.mjs";
import jwt from 'jsonwebtoken'
import { SECRET_KEY, SESSION_EXPIRES_IN } from "../index.mjs";

export const register = async (request, reply) => {
  const { name, email, user, pass } = request.body;
  let type = request.body.type ? request.body.type : "client";

  const sequelize = new Sequelize(sequelizeOpts);
  const User = sequelize.define("User", UserSchema);

  try {
    await User.create({ name, email, user, pass, type });
    await sequelize.close();
    const token = jwt.sign({ user, pass, type }, SECRET_KEY, {
      expiresIn: SESSION_EXPIRES_IN,
    });
    reply.status(201).send({ token: token });
  } catch (e) {
    reply.status(409).send({ error: e.errors[0].message });
  }
}