import { base64ToFile } from '@/assets/utils/Base64Utils'
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
    cacheId?: number
    finished: boolean
    url: string
    title: string
    desc: string
    icon: string
    color: string
    uploading: boolean
    saved: boolean
}

const defaultHyperLinkCache: HyperLinkCache = {
    id: -1,
    finished: false,
    url: 'https://vuejs.org/',
    title: 'Vue.js',
    desc: 'The Progressive JavaScript Framework',
    icon: 'data:image/webp;base64,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',
    color: '#a4edba',
    uploading: false,
    saved: false
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

async function fetchNewHyperLink(url:string): Promise<HyperLinkCache> {
    return axiosInstance
        .post<HyperLinkCache>('hyperlink-caches/', {
            url: url
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
            uploading: false,
            saved: true
        })
    }
    return hyperLinkCacheList
}

async function saveAndUpdateHyperLink(hyperLinkCache: HyperLinkCache): Promise<boolean> {
    try {
        if (hyperLinkCache.id === -1) {
            const formData = new FormData()
            formData.append('url', hyperLinkCache.url)
            formData.append('title', hyperLinkCache.title)
            formData.append('desc', hyperLinkCache.desc)
            formData.append(
                'color',
                hyperLinkCache.color.startsWith('#')
                    ? hyperLinkCache.color
                    : '#' + hyperLinkCache.color
            )
            formData.append('icon', base64ToFile(hyperLinkCache.icon))
            const response = await axiosInstance.post('hyperlinks/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return response.status.toString().startsWith('2')
        }
        const formData = new FormData()
        formData.append('url', hyperLinkCache.url)
        formData.append('title', hyperLinkCache.title)
        formData.append('desc', hyperLinkCache.desc)
        formData.append(
            'color',
            hyperLinkCache.color.startsWith('#') ? hyperLinkCache.color : '#' + hyperLinkCache.color
        )
        if (hyperLinkCache.icon.startsWith('data:image')) {
            formData.append('icon', base64ToFile(hyperLinkCache.icon))
        }
        const response = await axiosInstance.patch(`hyperlinks/${hyperLinkCache.id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.status.toString().startsWith('2')
    } catch (e) {
        console.error(`Error occurred while updating hyperlinks: ${e}`)
        return false
    }
}

async function deleteHyperLink(id: number): Promise<boolean> {
    try {
        const response = await axiosInstance.delete(`hyperlinks/${id}/`)
        return response.status.toString().startsWith('2')
    } catch (e) {
        console.error(`Error occurred while deleting hyperlinks: ${e}`)
        return false
    }
}

async function getHyperLinkCache(id:number):Promise<HyperLinkCache> {
    try {
        const response = await axiosInstance.get<HyperLinkCache>(`hyperlink-caches/${id}/`)
        return response.data
    } catch (error) {
        console.error(`Error occurred while fetching hyperlinks: ${error}`)
        throw error
    }
}

export {
    getHyperLinks,
    fetchNewHyperLink,
    gethyperLinkCacheList,
    saveAndUpdateHyperLink,
    deleteHyperLink,
    getHyperLinkCache,
    defaultHyperLinkCache
}
export type { HyperLink, HyperLinkCache }
