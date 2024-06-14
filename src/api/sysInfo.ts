import { axiosInstance } from '@/api/auth'

interface SystemInfo {
    name: string
    version: string
    profile: string
    avatar: string
    slogan: string
    banner: string
    contacts: {
        telegram: string
        qq: string
        email: string
        github: string
        weibo: string
        zhihu: string
        twitter: string
        facebook: string
        instagram: string
        linkedin: string
    }
}

interface SystemInfoItem {
    id: number
    name: string
    value: string
}

interface ContactItem {
    title: string
    content: string
}

async function getSystemInfo(): Promise<SystemInfo> {
    try {
        const response = await axiosInstance.get<Array<SystemInfoItem>>('sysInfo/')
        const findValue = (name: string) => {
            const item = response.data.find((item) => item.name === name)
            return item ? item.value : ''
        }
        const contacts: Array<ContactItem> = Object.entries(JSON.parse(findValue('contacts'))).map(
            ([title, content]) => ({
                title: title as string,
                content: content as string
            })
        )
        const findContact = (name: string) => {
            const item = contacts.find((item) => item.title === name)
            return item ? item.content : ''
        }

        const systemInfo: SystemInfo = {
            name: findValue('name'),
            version: findValue('version'),
            profile: findValue('profile'),
            avatar: findValue('avatar'),
            slogan: findValue('slogan'),
            banner: findValue('banner'),
            contacts: {
                telegram: findContact('telegram'),
                qq: findContact('qq'),
                email: findContact('email'),
                github: findContact('github'),
                weibo: findContact('weibo'),
                zhihu: findContact('zhihu'),
                twitter: findContact('twitter'),
                facebook: findContact('facebook'),
                instagram: findContact('instagram'),
                linkedin: findContact('linkedin')
            }
        }
        return systemInfo
    } catch (error) {
        console.error(`Error occurred while fetching system info: ${error}`)
        throw error // Or return an object with error info
    }
}

export { getSystemInfo }
export type { SystemInfo, SystemInfoItem }
