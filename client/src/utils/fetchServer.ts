export async function fetchServer(
    url: string,
    opts?: {
        token?: string | null
        method?: string
    },
    body?: {}
) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json')
    headers.append('token', opts?.token || '');

    let fetchOpts: RequestInit = {
        method: opts?.method || 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        headers: headers,
        body: JSON.stringify(body)
    }

    if (fetchOpts.method === 'GET') delete fetchOpts.body

    try {
        const response = await fetch(url, fetchOpts)
        return response
    } catch (err) {
        throw new Error('Não foi possível conectar ao servidor.')
    }
}