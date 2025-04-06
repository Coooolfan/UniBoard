/**
 * 深度克隆一个对象，优先使用structuredClone，不支持时回退到JSON序列化方案
 * @param obj 需要克隆的对象
 * @returns 返回克隆后的新对象
 * @example
 * const original = { a: 1, b: { c: 2 } };
 * const clone = cloneWithFallback(original);
 * // clone 是一个全新的对象，修改clone不会影响original
 */
export function cloneWithFallback<T>(obj: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(obj)
    } else {
        return JSON.parse(JSON.stringify(obj))
    }
}
