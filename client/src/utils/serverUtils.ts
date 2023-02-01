import { DELETE_PRODUCTS_URL, GET_IMAGES_URL, UPLOAD_PHOTOS_URL } from "./urls";

export const fetchServer = async (url: string, opts?: {
    token?: string | null,
    method?: string | 'GET',
    amount?: number,
}, body?: {}) => {
    // const response = await fetchServer(REGISTER_URL, { method: "POST" }, data);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json')
    headers.append('token', opts?.token || '')
    opts?.amount && headers.append('amount', opts.amount.toString())
    const fetchOpts: RequestInit = {
        method: opts?.method || "GET",
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        headers: headers,
        body: JSON.stringify(body)
    }

    if (fetchOpts.method === "GET") delete fetchOpts.body
    try {
        const response = await fetch(url, fetchOpts)
        return response
    } catch (err) {
        console.log(err)
        throw new Error('Não foi possível conectar ao servidor')
    }
}

export const deleteProductsFromDB = async (names: string[], token: string) => {

    try {
        const response = await fetchServer(DELETE_PRODUCTS_URL, { token: token, method: 'DELETE' }, { names })
        return response
    } catch (err) {
        throw new Error('Erro ao conectar ao servidor')
    }

}

export const sendFilesToServer = async (files: any, product_name: string, token: string | null) => {

    const formData = new FormData();
    const keys = Object.keys(files);

    keys.forEach((key) => {
        formData.append("file", files[key])
    })

    const headers = new Headers
    headers.append('token', token || '')
    headers.append('product_name', product_name)
    const res = await fetch(UPLOAD_PHOTOS_URL, {
        headers: headers,
        method: 'POST',
        body: formData
    })

    return res
}

export const getSellerImagesFromServer = async (names: string[], seller: string, amount: number = 1) => {
    const validNames = names.join(';');
    console.log(validNames)
    const headers = new Headers;
    headers.append('names', validNames);
    headers.append('seller', seller);
    headers.append('amount', amount.toString());
    headers.append('Accept-Encoding', 'gzip, deflate, br');
    headers.append('Connection', 'keep-alive');
    try {
        const response = await fetch(GET_IMAGES_URL, { headers: headers });
        return response;
    } catch (err) {
        throw err
    }
}