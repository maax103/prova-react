import jwt from 'jsonwebtoken'
import { Sequelize } from 'sequelize';
import { sequelizeOpts } from '../db/db_utils.mjs';
import { ProductsSchema } from '../db/schemas.mjs';
import { SECRET_KEY } from '../index.mjs';


export const set_product = async (request, reply) => {
  const token = request.headers.token;

  try {
    const data = jwt.verify(token, SECRET_KEY);
    if (data.type !== "seller") {
      reply.status(401).send({ message: "Não autorizado." });
    }
    const { category, subCategory, name, price, description, amount } = request.body;
    const sequelize = new Sequelize(sequelizeOpts);
    const Products = sequelize.define("Products", ProductsSchema);
    try {
      const newProduct = await Products.findByPk(name);
      if (newProduct !== null) {
        reply.status(409).send({ message: "Erro. Produto já cadastrado." });
      }
      await Products.create({
        category,
        subCategory,
        name,
        price,
        description,
        seller: data.user,
        amount: amount
      });
      await sequelize.close();

      reply.status(201).send({ message: "Produto cadastrado com sucesso." });
    } catch (e) {
      console.log(e);
      reply.status(409).send({ message: e });
    }
  } catch {
    reply
      .status(400)
      .send({ message: "Solicitação inválida ou acesso expirado." });
  }
}