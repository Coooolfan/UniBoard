import { axiosInstance } from './auth'

interface sysConfig {
    host: string
    show_copyright: boolean
    loading: boolean
}

const defaultSysConfig: sysConfig = {
    host: '',
    show_copyright: true,
    loading: false
}

async function getSysConfig(): Promise<sysConfig> {
    try {
        const response = await axiosInstance.get<Array<sysConfig>>('sys-config/')
        const sysConfig = response.data[0]
        sysConfig.loading = false
        return sysConfig
    } catch (error) {
        console.error(`Error occurred while fetching sys config: ${error}`)
        throw error
    }
}

async function patchSysConfig(sysConfig: sysConfig): Promise<boolean> {
    try {
        const response = await axiosInstance.patch('sys-config/1/', sysConfig)
        return response.status.toString().startsWith('2')
    } catch (error) {
        console.error(`Error occurred while patching sys config: ${error}`)
        return false
    }
}

export { defaultSysConfig, getSysConfig, patchSysConfig }
export type { sysConfig }
