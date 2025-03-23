import { Api } from "./__generated";

const BASE_URL = "";

// 导出全局变量`api`
export const api = new Api(async({uri, method, headers, body}) => {
    const tenant = (window as any).__tenant as string | undefined;
    const response = await fetch(`${BASE_URL}${uri}`, {
        method,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            ...headers,
            ...(tenant !== undefined && tenant !== "" ? {tenant} : {})
        }
    });
    if (response.status !== 200) {
        throw response.json();
    }
    const text = await response.text();
    if (text.length === 0) {
        return null;
    }
    return JSON.parse(text);
});