import { axiosInstance } from './auth'
interface HyperLink {
    id: number
    title: string
    desc: string
    url: string
    icon: string
    color: string
}

interface HyperLinkCache {
    id: number
    finished: Boolean
    url: string
    title: string
    desc: string
    icon: string
    color: string
    uploading: Boolean
}

async function getHyperLinks(): Promise<Array<HyperLink>> {
    try {
        const response = await axiosInstance.get<Array<HyperLink>>('hyperlinks/')
        return response.data
    } catch (error) {
        console.error(`Error occurred while fetching hyperlinks: ${error}`)
        throw error
    }
}

async function fetchNewHyperLink(): Promise<HyperLinkCache> {
    return axiosInstance
        .post<HyperLinkCache>('hyperlink-caches/', {
            url: 'https://cloudreve.org/'
        })
        .then((response) => {
            return response.data
        })
}

async function gethyperLinkCacheList() {
    let hyperLinkList = await getHyperLinks()
    let hyperLinkCacheList: Array<HyperLinkCache> = []
    for (let i = 0; i < hyperLinkList.length; i++) {
        hyperLinkCacheList.push({
            id: hyperLinkList[i].id,
            finished: false,
            url: hyperLinkList[i].url,
            title: hyperLinkList[i].title,
            desc: hyperLinkList[i].desc,
            icon: hyperLinkList[i].icon,
            color: hyperLinkList[i].color,
            uploading: false
        })
    }
    return hyperLinkCacheList
}

async function patchHyperLink(hyperLinkCache: HyperLinkCache): Promise<Boolean> {
    try {
        let res = await axiosInstance.patch(`hyperlinks/${hyperLinkCache.id}/`, {
            title: hyperLinkCache.title,
            desc: hyperLinkCache.desc,
            color: hyperLinkCache.color.startsWith('#')
                ? hyperLinkCache.color
                : '#' + hyperLinkCache.color,
            url: hyperLinkCache.url
        })
        return res.status.toString().startsWith('2')
    } catch (e) {
        console.error(`Error occurred while updating hyperlinks: ${e}`)
        return false
    }
}

export { getHyperLinks, fetchNewHyperLink, gethyperLinkCacheList, patchHyperLink }
export type { HyperLink, HyperLinkCache }
