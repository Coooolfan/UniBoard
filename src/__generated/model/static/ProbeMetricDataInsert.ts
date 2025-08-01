import type {ProbeMetricDataInsertItem} from './';

/**
 * 探针指标数据上报请求体
 * 
 * 用于接收探针客户端上报的监控数据
 * 
 */
export interface ProbeMetricDataInsert {
    /**
     * 探针目标ID
     */
    readonly targetId: number;
    /**
     * 探针目标的验证密钥，用于身份验证
     */
    readonly key: string;
    /**
     * 要上报的指标数据列表
     */
    readonly datas: ReadonlyArray<ProbeMetricDataInsertItem>;
}
