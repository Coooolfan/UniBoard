import { axiosInstance } from "./auth"
interface HyperLink {
    id: number
    title: string
    desc: string
    url: string
    icon: string
    color: string
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

export { getHyperLinks }
export type { HyperLink }
