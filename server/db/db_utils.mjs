import { Sequelize, Op, ConnectionRefusedError } from "sequelize";
import { ProductsSchema, UserSchema } from "./schemas.mjs";
import path from "path"
import fs from 'fs'

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

export function writeFileOnServer(file) {

}

export function getImageBufferBySellerAndProducts(names, user, amount = 1) {
  const arrayOfProducts = names.split(';');
  let response = {};
  arrayOfProducts.forEach(elem => {
    let product_buffer = [];
    const product = elem.trim().toLowerCase().replace(' ', '_');

    const folderPath = path.join(process.cwd(), 'db', 'product_images', user, product);
    if (!fs.existsSync(folderPath)) return

    const filesInFolder = fs.readdirSync(folderPath).length
    if (filesInFolder === 0) return

    const requestedFiles = filesInFolder > amount ? amount : filesInFolder;
    for (let i = 1; i <= requestedFiles; i++) {

      const filePath = path.join(
        process.cwd(),
        'db',
        'product_images',
        user, product,
        `p${i}.png`
      );
      if (!fs.existsSync(filePath)) return


      const bitmap = fs.readFileSync(filePath)
      const image_b64 = Buffer.from(bitmap).toString("base64");
      product_buffer.push(image_b64)
    }
    response[product] = product_buffer;
  })
  return response;
}

export async function getRandomProducts(sellers, amount = 3) {
  // console.log(sellers)
  const sequelize = new Sequelize(sequelizeOpts);
  const Products = sequelize.define("Products", ProductsSchema);

  const sqlite_response = await Products.findAll({
    where: {
      seller: {
        [Op.or]: ['max'] //sellers,
      }
    }
  })
  // console.log(sqlite_response)

  let response = {};
  // console.log(sqlite_response.length)
  for (const index in sqlite_response) {
    const { name, category, subCategory, price, seller, amount } = (sqlite_response[index].dataValues)
    if (response[seller]) {
      response[seller] = {
        ...response[seller],
        [name]:
          { name, category, subCategory, price, seller, amount }
      };
    } else {
      response[seller] = { [name]: { name, category, subCategory, price, seller, amount } }
      // console.log(response)
    }
  }
  let response_copy = response;
  response = []
  for (const seller in response_copy) {
    let products = [];
    for (const product in response_copy[seller]) {
      products = [...products, response_copy[seller][product]]
    }
    response = [...response, { seller: seller, products: products }];
    // console.log(response[0].products)

    //   ...response, {
    //   seller: seller,
    //   products: [response_copy[seller] ...response_copy[seller]}]
    // }]
  }
  response = response.map(elem => ({
    seller: elem.seller,
    products: getRandomValuesFromArray(elem.products, amount)
  }))
  // console.log(response)
  await sequelize.close()
  return response;
}

export async function getRandomSellers(sellersAmount = 3, productsAmount = 10) {
  const sequelize = new Sequelize(sequelizeOpts);
  const User = sequelize.define("User", UserSchema);

  const totalSeller = await User.count({
    where: {
      type: 'seller'
    }
  })

  const randomSellersAmount = sellersAmount > totalSeller ? totalSeller : sellersAmount;

  const users_data = await User.findAll({
    where: {
      type: 'seller'
    }, attributes: ['user']
  })
  await sequelize.close()

  const users = users_data.map(data => data.dataValues.user)
  const randomSellers = getRandomValuesFromArray(users, randomSellersAmount);
  return randomSellers
}

function getRandomValuesFromArray(array, amount = 1) {
  const randomArray = array.sort(() => 0.5 - Math.random());
  return randomArray.slice(0, amount)
}
