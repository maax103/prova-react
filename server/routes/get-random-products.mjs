import { getImageBufferBySellerAndProducts, getRandomProducts, getRandomSellers } from "../db/db_utils.mjs";

export const get_random_products = async (request, reply) => {
  const amount = request.headers.amount || 5;
  try {
    const randomSellers = await getRandomSellers(10);
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

}