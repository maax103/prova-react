import { Op, Sequelize } from "sequelize";
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from "../index.mjs";
import { sequelizeOpts } from "../db/db_utils.mjs";
import { ProductsSchema } from "../db/schemas.mjs";
import fs from 'fs'

export const delete_products = async (request, reply) => {
  const token = request.headers.token;
  const { names: arrayOfProducts } = request.body;
  // console.log(token, arrayOfProducts)
  if (arrayOfProducts ? arrayOfProducts.length === 0 : true)
    reply.status(401).send({ message: "Não autorizado." });

  try {
    const { user, type } = jwt.verify(token, SECRET_KEY);

    if (type !== "seller")
      reply.status(401).send({ message: "Não autorizado. Você não possui uma conta de vendedor." });

    const sequelize = new Sequelize(sequelizeOpts);
    const Products = sequelize.define("Products", ProductsSchema);

    const sql_response = await Products.destroy({
      where: {
        seller: user,
        name: {
          [Op.or]: arrayOfProducts,
        },
      },
    });
    sequelize.close();

    arrayOfProducts.forEach(name => {
      const product_name = name.trim().replace(' ', '_').toLowerCase();
      const dir = `./db/product_images/${user}/${product_name}/`;
      fs.rmSync(dir, { recursive: true, force: true });
    })

    reply.status(200).send({ message: "Excluído com sucesso." });
  } catch (err) {
    console.log(err);
  }
}