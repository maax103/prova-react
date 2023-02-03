import jwt from 'jsonwebtoken'
import fs from 'fs'
import util from 'util'
import { pipeline } from 'stream'
import { SECRET_KEY } from '../index.mjs'

export const upload_images = async (request, reply) => {
  const pump = util.promisify(pipeline)
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
      console.log('oi')
      fs.rmSync(`./db/product_images/${user}/${product_name}/`, { recursive: true, force: true });
      console.log('oi')
      fs.mkdirSync(dir, { recursive: true })
      console.log('oi')
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
}