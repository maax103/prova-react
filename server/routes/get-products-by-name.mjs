import { getImagesByName, getProductsByName } from "../db/db_utils.mjs";

export const get_products_by_name = async (request, reply) => {
  const headerInfo = request.headers.names;
  try {
    const names = headerInfo.split(';')
    const products = await getProductsByName(names);
    const productsAndSeller = products.map(product => ({ seller: product.seller, product: product.name }))
    const images = getImagesByName(productsAndSeller, 1);

    const response = products.map(product => {
      try {
        const data = {...product.dataValues, images: images[product.dataValues.name].images}
        return data
      } catch {
        return {}
      }
    })
    reply.status(200).send(response);
  } catch (err) {
    reply.status(400).send({ message: "Erro ao buscar dados de produtos" });
  }
}