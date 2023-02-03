import jwt from 'jsonwebtoken'
import { Sequelize } from 'sequelize';
import { sequelizeOpts } from '../db/db_utils.mjs';
import { ProductsSchema } from '../db/schemas.mjs';
import { SECRET_KEY } from '../index.mjs';

export const change_products = async (request, reply) => {
  const token = request.headers.token;
  try {
    const {
      "edit-name": name,
      "edit-price": price,
      "edit-category": category,
      "edit-subCategory": subCategory,
      "edit-description": description,
      "edit-amount": amount
    } = request.body;

    const { user, type } = jwt.verify(token, SECRET_KEY);

    if (type !== 'seller') reply.status(401).send({ message: "Não autorizado. Você não possui uma conta de vendedor." });

    const sequelize = new Sequelize(sequelizeOpts);
    const Products = sequelize.define("Products", ProductsSchema);

    await Products.update(
      { name, price, category, subCategory, description, amount },
      {
        where: {
          name: name,
          seller: user,
        },
      }
    );
    await sequelize.close();
    reply.status(200).send({ message: "Alteração efetuada com sucesso." });
  } catch (err) {
    console.log(err);
    reply.status(401).send({ message: "Não autorizado." });
  }
}