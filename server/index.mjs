import fastify from "fastify";
import cors from "@fastify/cors";
import { Sequelize, DataTypes } from "sequelize";
import jwt from "jsonwebtoken";
import { sequelizeOpts, UserSchema } from "./db/schemas.mjs";

const SECRET_KEY =
  "173af653133d964edfc16cafe0aba33c8f500a07f3ba3f81943916910c257705";

const sequelize = new Sequelize(sequelizeOpts);
const User = sequelize.define("User", UserSchema);
await sequelize.sync();
sequelize.close;

// const token = jwt.sign({ foo: "bar" }, SECRET_KEY, {
//   expiresIn: "10000",
//   noTimestamp: true,
// });
// // console.log(token);
// const data = jwt.verify(token, SECRET_KEY, (err, decoded) => {
//   if (err) {
//     console.log(err);
//   } else {
//     return "hello";
//   }
// });
// console.log(data);

// const max = await User.findByPk("max");
// console.log(max);
// await User.create({ login: "max", pass: "123" });
// await createUser(User, {login: 'max', pass: '123'})

// const users = await User.findAll();
// console.log("All users: ", JSON.stringify(users, null, 2));

const server = fastify();
const PORT = 8080;

server.register(cors);

server.post("/register", async (request, reply) => {
  const { name, email, user, pass } = request.body;

  const sequelize = new Sequelize(sequelizeOpts);
  const User = sequelize.define("User", UserSchema);

  try {
    await User.create({ name, email, user, pass });
    await sequelize.close();
    const token = jwt.sign({ user, pass }, SECRET_KEY);
    reply.status(201).send({ token: token });
  } catch (e) {
    reply.status(409).send({ error: e.errors[0].message });
  }
});

server.post("/login", async (request, reply) => {
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
      const token = jwt.sign({ user, pass }, SECRET_KEY);
      reply.status(200).send({ isValid: true, token: token });
    }
  } catch (e) {
    reply.status(401).send({ message: e });
  }
});

server.listen({ port: PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server iniciado. Exposto em: ${address}`);
});
