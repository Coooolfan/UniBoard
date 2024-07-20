import { axiosInstance } from '@/api/auth'
import { base64ToFile } from '@/assets/utils/Base64Utils'

interface UserInfo {
    name: string
    version: string
    profile: string
    avatar: string
    slogan: string
    banner: string
    name_font: string | Blob
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
    loading: boolean
}

const defaultUserInfo: UserInfo = {
    name: '',
    version: '',
    profile: '',
    avatar: '',
    slogan: '',
    banner: '',
    name_font: 'fonts/fonnts.com-Congenial_Bold.otf',
    contacts: {
        telegram: '',
        qq: '',
        email: '',
        github: '',
        weibo: '',
        zhihu: '',
        twitter: '',
        facebook: '',
        instagram: '',
        linkedin: ''
    },
    loading: false
}

async function getUserInfo(): Promise<UserInfo> {
    try {
        const response = await axiosInstance.get<Array<UserInfo>>('user-info/')
        const userInfo = response.data[0]
        return userInfo
    } catch (error) {
        console.error(`Error occurred while fetching user info: ${error}`)
        throw error // Or return an object with error info
    }
}

async function patchUserInfo(userInfo: UserInfo): Promise<boolean> {
    try {
        // 创建FormData对象并附加userInfo对象的属性
        // 需要传入二进制对象
        const formData = new FormData()
        formData.append('name', userInfo.name)
        formData.append('profile', userInfo.profile)
        formData.append('slogan', userInfo.slogan)
        formData.append('contacts', JSON.stringify(userInfo.contacts))
        // 将base64字符串转换为Blob对象并附加到FormData对象, 如果是URL则说明没有修改
        if (userInfo.avatar.startsWith('data:image')) {
            formData.append('avatar', base64ToFile(userInfo.avatar))
        }
        if (userInfo.banner.startsWith('data:image')) {
            formData.append('banner', base64ToFile(userInfo.banner))
        }
        if (typeof userInfo.name_font === 'object' && userInfo.name_font !== null) {
            formData.append('name_font', userInfo.name_font)
        }

        // 设置Content-Type为multipart/form-data
        const response = await axiosInstance.patch('user-info/1/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.status.toString().startsWith('2')
    } catch (error) {
        console.error(`Error occurred while updating user info: ${error}`)
        return false
    }
}

export { getUserInfo, patchUserInfo, defaultUserInfo }
export type { UserInfo }
