import { DELETE_PRODUCTS_URL } from "./urls";

export const fetchServer = async (url: string, opts?: {
    token?: string | null,
    method?: string | 'GET'
}, body?: {}) => {
    // const response = await fetchServer(REGISTER_URL, { method: "POST" }, data);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json')
    headers.append('token', opts?.token || '')
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

export const deleteProductsFromDB = async (names : string[], token: string) => {
    
    try {
        const response = await fetchServer(DELETE_PRODUCTS_URL, {token: token, method: 'DELETE'}, names)
        return response
    } catch (err) {
        throw new Error('Erro ao conectar ao servidor')
    }

}