import { getImageBufferBySellerAndProducts } from "../db/db_utils.mjs";

export const get_images = async (request, reply) => {
  try {
    const names = request.headers.names;
    const user = request.headers.seller;
    const amount = request.headers.amount || 1;
    const response = getImageBufferBySellerAndProducts(names, user, amount);
    reply.header('Content-Type', 'application/json')
    reply.status(200).send({ message: 'deu certo', buffers: response })
    return reply
  } catch (err) {
    console.log(err)
    reply.status(400).send({ message: 'Deu errado' })
  }
}
