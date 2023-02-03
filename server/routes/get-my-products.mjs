import { Sequelize } from "sequelize";
import { sequelizeOpts } from "../db/db_utils.mjs";
import { ProductsSchema } from "../db/schemas.mjs";
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from "../index.mjs";

export const get_my_products = async (request, reply) => {
  const token = request.headers.token;
  const sequelize = new Sequelize(sequelizeOpts);
  const Products = sequelize.define("Products", ProductsSchema);

  try {
    const { type, user } = jwt.verify(token, SECRET_KEY);
    if (type !== "seller")
      reply.status(401).send({ message: "Não autorizado." });

    const products = await Products.findAll({ where: { seller: user } });
    await sequelize.close();

    reply.status(200).send(products);
  } catch (err) {
    reply
      .status(400)
      .send({ message: "Solicitação inválida ou acesso expirado." });
  }
}