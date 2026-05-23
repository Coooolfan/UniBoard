/**
 * 判断探测目标是否在线
 * @param timeString 最后报告时间字符串
 * @returns 是否在线（5分钟内有报告视为在线）
 */
export function isOnline(timeString: string): boolean {
    const reportDate = new Date(timeString)
    const now = new Date()
    const diffMs = now.getTime() - reportDate.getTime()
    // 5分钟 = 5 * 60 * 1000 毫秒
    return diffMs <= 5 * 60 * 1000
}
