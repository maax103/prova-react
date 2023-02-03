import { Sequelize } from "sequelize";
import { sequelizeOpts } from "../db/db_utils.mjs";
import { ProductsSchema } from "../db/schemas.mjs";

export const get_products = async (request, reply) => {
  const sequelize = new Sequelize(sequelizeOpts);
  const Products = sequelize.define("Products", ProductsSchema);

  try {
    const products = await Products.findAll();
    await sequelize.close();

    reply.status(200).send(products);
  } catch (err) {
    reply.status(400).send({ message: "Erro no servidor" });
  }
}