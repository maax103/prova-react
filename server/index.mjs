import fastify from "fastify";
import cors from "@fastify/cors";
import { Sequelize, DataTypes } from "sequelize";
import jwt from "jsonwebtoken";
import { ProductsSchema, UserSchema } from "./db/schemas.mjs";
import { db_initializer, sequelizeOpts } from "./db/db_utils.mjs";

const SECRET_KEY =
  "173af653133d964edfc16cafe0aba33c8f500a07f3ba3f81943916910c257705";
const SESSION_EXPIRES_IN = '1h'
const PORT = 8001;
const server = fastify();

await db_initializer();

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

server.register(cors);

server.post("/register", async (request, reply) => {
  const { name, email, user, pass } = request.body;
  let type = request.body.type ? request.body.type : 'client';

  const sequelize = new Sequelize(sequelizeOpts);
  const User = sequelize.define("User", UserSchema);

  try {
    await User.create({ name, email, user, pass, type });
    await sequelize.close();
    const token = jwt.sign({ user, pass, type }, SECRET_KEY, { expiresIn: SESSION_EXPIRES_IN });
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
      const token = jwt.sign({ user, pass, type: loginUser.dataValues.type }, SECRET_KEY, { expiresIn: SESSION_EXPIRES_IN });
      // console.log(token)
      reply.status(200).send({ isValid: true, token: token, type: loginUser.dataValues.type });
    } else {
      reply.status(200).send({ isValid: false })
    }
  } catch (e) {
    reply.status(401).send({ message: e });
  }
});

server.get("/get-products", async (request, reply) => {
  const sequelize = new Sequelize(sequelizeOpts)
  const Products = sequelize.define("Products", ProductsSchema)

  try {
    const products = await Products.findAll()
    await sequelize.close();

    reply.status(200).send(products)

  } catch (err) {
    reply.status(400).send({ message: 'Erro no servidor' })
  }

})

server.post("/set-product", async (request, reply) => {

  const token = request.headers.token;

  try {
    const data = jwt.verify(token, SECRET_KEY);
    if (data.type !== 'seller') {
      reply.status(401).send({ message: 'Não autorizado.' })
    }
  } catch {
    reply.status(400).send({ message: 'Solicitação inválida ou acesso expirado.' })
  }
  const { category, subCategory, name, price, descrption } = request.body
  const sequelize = new Sequelize(sequelizeOpts)
  const Products = sequelize.define("Products", ProductsSchema)
  try {
    const newProduct = await Products.findByPk(name);
    if (newProduct !== null) {
      reply.status(409).send({ message: 'Erro. Produto já cadastrado.' })
    }
    await Products.create({ category, subCategory, name, price, descrption })
    await sequelize.close()

    reply.status(201).send({ message: 'Produto cadastrado com sucesso.' })
  } catch (e) {
    reply.status(409).send({ message: e })
  }
})

server.listen({ port: PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server iniciado. Exposto em: ${address}`);
});
