import { Sequelize } from "sequelize";
import { ProductsSchema, UserSchema } from "./schemas.mjs";

export const sequelizeOpts = {
  dialect: "sqlite",
  storage: "./db/database.sqlite",
  logging: false,
};

export async function db_initializer() {
  const sequelize = new Sequelize(sequelizeOpts);

  const User = sequelize.define("User", UserSchema);
  const Products = sequelize.define('Products', ProductsSchema);

  await sequelize.sync();
  sequelize.close;
}
