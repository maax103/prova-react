import { Sequelize } from "sequelize";
import jwt from "jsonwebtoken";
import { SECRET_KEY, SESSION_EXPIRES_IN } from "../index.mjs";
import { sequelizeOpts } from "../db/db_utils.mjs";
import { UserSchema } from "../db/schemas.mjs";

export const login = async (request, reply) => {
  const { user, pass } = request.body;
  const sequelize = new Sequelize(sequelizeOpts);
  const User = sequelize.define("User", UserSchema);

  try {
    const loginUser = await User.findByPk(user);
    if (loginUser) {
      if (loginUser.dataValues.pass != pass) {
        throw new Error("Usuário ou senha inválidos.");
      }
      await sequelize.close();
      const token = jwt.sign(
        { user, pass, type: loginUser.dataValues.type },
        SECRET_KEY,
        { expiresIn: SESSION_EXPIRES_IN }
      );
      reply
        .status(200)
        .send({ isValid: true, token: token, type: loginUser.dataValues.type });
    } else {
      reply.status(200).send({ isValid: false });
    }
  } catch (e) {
    reply.status(401).send({ message: e });
  }
}