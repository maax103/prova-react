import fastify from "fastify";
import cors from "@fastify/cors";
import { Sequelize, DataTypes } from "sequelize";
import jwt from "jsonwebtoken";
import { ProductsSchema, UserSchema } from "./db/schemas.mjs";
import { db_initializer, getImageBufferBySellerAndProducts, getRandomProducts, getRandomSellers, sequelizeOpts } from "./db/db_utils.mjs";
import { Op } from "sequelize";
import util from 'util'
import { pipeline } from "stream";
import multipart from '@fastify/multipart'
import fs from 'fs'
import path from "path";
const pump = util.promisify(pipeline)

const SECRET_KEY =
  "173af653133d964edfc16cafe0aba33c8f500a07f3ba3f81943916910c257705";
const SESSION_EXPIRES_IN = "1h";
const PORT = 8001;
const server = fastify();

await db_initializer();

server.register(cors);
server.register(multipart)

server.post("/register", async (request, reply) => {
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
      const token = jwt.sign(
        { user, pass, type: loginUser.dataValues.type },
        SECRET_KEY,
        { expiresIn: SESSION_EXPIRES_IN }
      );
      // console.log(token)
      reply
        .status(200)
        .send({ isValid: true, token: token, type: loginUser.dataValues.type });
    } else {
      reply.status(200).send({ isValid: false });
    }
  } catch (e) {
    reply.status(401).send({ message: e });
  }
});

server.get("/get-products", async (request, reply) => {
  const sequelize = new Sequelize(sequelizeOpts);
  const Products = sequelize.define("Products", ProductsSchema);

  try {
    const products = await Products.findAll();
    await sequelize.close();

    reply.status(200).send(products);
  } catch (err) {
    reply.status(400).send({ message: "Erro no servidor" });
  }
});

server.get("/get-random-products", async (request, reply) => {
  const amount = request.headers.amount || 5;
  try {
    const randomSellers = await getRandomSellers();
    console.log(randomSellers, amount)
    const response = await getRandomProducts(randomSellers, amount);
    const res = response.map(elem => {
      const products = elem.products.map(product => product.name);
      const validNames = products.join(';')
      const images = getImageBufferBySellerAndProducts(validNames, elem.seller, amount)
      return Object.assign(elem, {
        products: elem.products.map(item => {
          const validName = item.name.trim().toLowerCase().replace(' ', '_')
          return { ...item, images: images[validName] || [] }
        })
      })
    })

    reply.status(200).send(res)
  } catch (err) {
    reply.status(401).send({ message: 'Erro ao buscar vendedores.' })
  }

})

server.get("/get-my-products", async (request, reply) => {
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
});

server.delete("/delete-products", async (request, reply) => {
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
      // console.log(product_name)
    })

    reply.status(200).send({ message: "Excluído com sucesso." });
  } catch (err) {
    console.log(err);
  }
});

server.put("/change-product", async (request, reply) => {
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
    console.log(request.body, user, type);

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
});

server.post("/set-product", async (request, reply) => {
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
      // console.log(data);
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
});

server.get("/get-images", async (request, reply) => {

  try {
    const names = request.headers.names;
    const user = request.headers.seller;
    const amount = request.headers.amount || 1;
    const response = getImageBufferBySellerAndProducts(names, user, amount);
    // const buffer = Buffer.from(file,{encoding: "base64"})
    reply.header('Content-Type', 'application/json')
    reply.status(200).send({ message: 'deu certo', buffers: response })
    return reply
  } catch (err) {
    console.log(err)
    reply.status(400).send({ message: 'Deu errado' })
  }
})

server.post("/upload-images", async (request, reply) => {
  // console.log()
  const data = request.files()
  const token = request.headers.token
  try {
    const { user, type } = jwt.verify(token, SECRET_KEY);
    if (type !== 'seller') reply.status(401).send({ message: "Erro. Usuário não é um vendedor." })

    const product_name = request.headers.product_name.trim().replace(' ', '_').toLowerCase()
    const dir = `./db/product_images/${user}/${product_name}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    } else {
      fs.rmSync(`./db/product_images/${user}/${product_name}/`, { recursive: true, force: true });
      fs.mkdirSync(dir, { recursive: true })
    }

    let i = 0;
    for await (const part of data) {
      // upload and save the file
      i = i + 1;
      if (i > 5) break
      await pump(part.file, fs.createWriteStream(`${dir}/p${i}.png`))

    }
    reply.status(201).send({ message: 'Imagens processadas com sucesso.' })
  } catch (err) {
    console.log(err)
    reply.status(400).send({ message: "Ocorreu um erro inesperado ao processar as imagens." })
  }
})

server.listen({ port: PORT }).then((url) => {
  console.log(`Server running at: ${url}`)
}).catch(err => {
  console.log(err)
})
