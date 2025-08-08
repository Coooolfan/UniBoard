declare module 'echarts-gl/charts' {
    import type { EChartsExtensionInstaller } from 'echarts/core'

    export interface ScatterGLSeriesOption {
        type: 'scatterGL'
        name?: string
        coordinateSystem?: string
        progressive?: number
        symbolSize?: number | ((params: any) => number)
        zoomScale?: number
        blendMode?: string
        large?: boolean
        itemStyle?: {
            color?: string
            [key: string]: any
        }
        postEffect?: {
            enable?: boolean
            [key: string]: any
        }
        silent?: boolean
        dimensions?: string[]
        data?: Float32Array | any[]
        [key: string]: any
    }

    export const ScatterGLChart: EChartsExtensionInstaller
}

declare module 'echarts-gl/components' {
    export interface Globe3DComponentOption {
        [key: string]: any
    }
}

declare module 'echarts-gl' {
    import { ScatterGLChart } from 'echarts-gl/charts'
    export { ScatterGLChart }
}
