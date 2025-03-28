import { Api } from './__generated'

const BASE_URL = ''

// 导出全局变量`api`
export const api = new Api(async ({ uri, method, headers, body }) => {
    const tenant = (window as any).__tenant as string | undefined
    const isFormData = body instanceof FormData
    const fetchHeaders: HeadersInit = {
        ...headers,
        ...(tenant !== undefined && tenant !== '' ? { tenant } : {})
    }
    if (isFormData) {
        fetchHeaders['Content-Type'] = 'multipart/form-data'
    }
    const response = await fetch(`${BASE_URL}${uri}`, {
        method,
        body: isFormData ? body : JSON.stringify(body),
        headers: fetchHeaders
    })
    if (response.status === 201) {
        alert('登录已过期，请重新登录')
        window.location.href = '/'
    }
    if (Math.floor(response.status / 100) !== 2) {
        throw response.json()
    }
    const text = await response.text()
    if (text.length === 0) {
        return null
    }
    return JSON.parse(text)
})
