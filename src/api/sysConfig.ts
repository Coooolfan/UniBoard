import { axiosInstance } from './auth'

interface sysConfig {
    host: string
}

const defaultSysConfig: sysConfig = {
    host: window.location.origin
}

async function getSysConfig(): Promise<sysConfig> {
    try {
        const response = await axiosInstance.get<Array<sysConfig>>('sys-config/')
        const sysConfig = response.data[0]
        return sysConfig
    } catch (error) {
        console.error(`Error occurred while fetching sys config: ${error}`)
        throw error // Or return an object with error info
    }
}

async function patchSysConfig(sysConfig: sysConfig): Promise<boolean> {
    try {
        const response = await axiosInstance.patch('sys-config/', sysConfig)
        return response.status.toString().startsWith('2')
    } catch (error) {
        console.error(`Error occurred while patching sys config: ${error}`)
        throw error // Or return an object with error info
    }
}

export { defaultSysConfig, getSysConfig, patchSysConfig }
export type { sysConfig }
