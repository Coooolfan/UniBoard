import { axiosInstance } from '@/api/auth'

interface SystemInfo {
    name: string
    version: string
    profile: string
    avater: string
}

interface SystemInfoItem {
    id: number
    name: string
    value: string
}

async function getSystemInfo(): Promise<SystemInfo> {
    try {
        const response = await axiosInstance.get<Array<SystemInfoItem>>('sysInfo/')
        console.log(response.data)
        const findValue = (name: string) => {
            const item = response.data.find((item) => item.name === name)
            return item ? item.value : ''
        }
        const systemInfo: SystemInfo = {
            name: findValue('name'),
            version: findValue('version'),
            profile: findValue('profile'),
            avater: findValue('avater')
        }
        return systemInfo
    } catch (error) {
        console.error(`Error occurred while fetching system info: ${error}`)
        throw error // Or return an object with error info
    }
}

export { getSystemInfo }
export type { SystemInfo, SystemInfoItem }
