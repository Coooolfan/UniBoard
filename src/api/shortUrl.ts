import { axiosInstance } from './auth'

interface ShortUrl {
    id: number
    long_url: string
    short_url: string
    gmt_create: string
}

interface getShortUrlListAPI{
    count: number
    results: Array<ShortUrl>
}

async function postShortUrl(long_url: string): Promise<ShortUrl> {
    const response = await axiosInstance.post('short-urls/', {
        long_url: long_url
    })
    return response.data
}

async function getShortUrlList(page?: string, size?: string): Promise<getShortUrlListAPI> {
    if (page == undefined) page = '1'
    if (size == undefined) size = '10'
    const response = await axiosInstance.get<getShortUrlListAPI>('short-urls/', {
        params: {
            page: page,
            size: size
        }
    })
    return response.data
}

export { postShortUrl, getShortUrlList }
export type { ShortUrl }
