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
import { login } from "./routes/login.mjs";
import { get_products } from "./routes/get-products.mjs";
import { get_random_products } from "./routes/get-random-products.mjs";
import { get_my_products } from "./routes/get-my-products.mjs";
import { delete_products } from "./routes/delete-products.mjs";
import { change_products } from "./routes/change-products.mjs";
import { set_product } from "./routes/set-product.mjs";
import { get_images } from "./routes/get-images.mjs";
import { upload_images } from "./routes/upload-images.mjs";
const pump = util.promisify(pipeline)

export const SECRET_KEY =
  "173af653133d964edfc16cafe0aba33c8f500a07f3ba3f81943916910c257705";
export const SESSION_EXPIRES_IN = "1h";
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

server.post("/login", login);
server.get("/get-products", get_products);
server.get("/get-random-products", get_random_products)
server.get("/get-my-products", get_my_products);
server.delete("/delete-products", delete_products);
server.put("/change-product", change_products);
server.post("/set-product", set_product);
server.get("/get-images", get_images)
server.post("/upload-images", upload_images)

server.listen({ port: PORT }).then((url) => {
  console.log(`Server running at: ${url}`)
}).catch(err => {
  console.log(err)
})
