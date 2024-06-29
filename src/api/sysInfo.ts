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

async function getSystemInfo(): Promise<SystemInfo> {
    try {
        const response = await axiosInstance.get<Array<SystemInfo>>('sysInfo/')
        const systemInfo = response.data[0]
        return systemInfo
    } catch (error) {
        console.error(`Error occurred while fetching system info: ${error}`)
        throw error // Or return an object with error info
    }
}

async function updateSystemInfo(systemInfo: SystemInfo): Promise<boolean> {
    try {
        // 创建FormData对象并附加systemInfo对象的属性
        // 需要传入二进制对象
        const formData = new FormData()
        formData.append('name', systemInfo.name)
        formData.append('version', systemInfo.version)
        formData.append('profile', systemInfo.profile)
        formData.append('slogan', systemInfo.slogan)
        formData.append('contacts', JSON.stringify(systemInfo.contacts))
        // 将base64字符串转换为Blob对象并附加到FormData对象, 如果是URL则说明没有修改
        if (systemInfo.avatar.startsWith('data:image')) {
            formData.append('avatar', base64ToFile(systemInfo.avatar))
        }
        if (systemInfo.banner.startsWith('data:image')) {
            formData.append('banner', base64ToFile(systemInfo.banner))
        }

        // 设置Content-Type为multipart/form-data
        const response = await axiosInstance.patch('sysInfo/1/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.status.toString().startsWith('2')
    } catch (error) {
        console.error(`Error occurred while updating system info: ${error}`)
        return false
    }
}

function base64ToFile(urlData: any) {
    let arr = urlData.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let bytes = atob(arr[1]) // 解码base64
    let n = bytes.length
    let ia = new Uint8Array(n)
    while (n--) {
        ia[n] = bytes.charCodeAt(n)
    }
    let fileName = 'file_' + Date.now() + '.' + mime.split('/')[1]
    return new File([ia], fileName, { type: mime })
}

export { getSystemInfo, updateSystemInfo }
export type { SystemInfo }
