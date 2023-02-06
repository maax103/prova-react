import fastify from "fastify";
import cors from "@fastify/cors";
import { db_initializer } from "./db/db_utils.mjs";
import multipart from '@fastify/multipart'
import {
  change_products,
  delete_products,
  get_images,
  get_my_products,
  get_products_by_name,
  get_products,
  get_random_products,
  login,
  register,
  set_product,
  upload_images
} from './routes/index.mjs'

export const SECRET_KEY =
  "173af653133d964edfc16cafe0aba33c8f500a07f3ba3f81943916910c257705";
export const SESSION_EXPIRES_IN = "1h";
const PORT = 8001;
const server = fastify();

await db_initializer();

server.register(cors);
server.register(multipart)

server.post("/register", register);
server.post("/login", login);
server.get("/get-products", get_products);
server.get("/get-random-products", get_random_products)
server.get("/get-my-products", get_my_products);
server.delete("/delete-products", delete_products);
server.put("/change-product", change_products);
server.post("/set-product", set_product);
server.get("/get-images", get_images)
server.post("/upload-images", upload_images)
server.get('/get-products-by-name', get_products_by_name)

server.listen({ port: PORT }).then((url) => {
  console.log(`Server running at: ${url}`)
}).catch(err => {
  console.log(err)
})
