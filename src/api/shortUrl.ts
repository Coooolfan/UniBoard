import { axiosInstance } from './auth'

interface ShortUrl {
    id: number
    long_url: string
    short_url: string
    gmt_create: string
    count: number
    local_create?: string
}

interface getShortUrlListAPI {
    count: number
    results: Array<ShortUrl>
}

async function postShortUrl(long_url: string): Promise<ShortUrl> {
    const response = await axiosInstance.post('short-urls/', {
        long_url: long_url
    })
    return response.data
}

async function getShortUrlList(page?: number, size?: number): Promise<getShortUrlListAPI> {
    if (page == undefined) page = 1
    if (size == undefined) size = 10
    const response = await axiosInstance.get<getShortUrlListAPI>('short-urls/', {
        params: {
            page: page,
            size: size
        }
    })
    return response.data
}

async function deleteShortUrl(id: number): Promise<boolean> {
    try {
        let resp = await axiosInstance.delete(`short-urls/${id}/`)
        if (resp.status.toString().startsWith('2')) {
            return true
        }
    } catch (error) {
        return false
    }
    return false
}

export { postShortUrl, getShortUrlList, deleteShortUrl }
export type { ShortUrl }
