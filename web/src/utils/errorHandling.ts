/**
 * 从直接的错误对象或Promise拒绝中解析API错误
 * 该函数用于统一处理API错误，将各种形式的错误转换为可预期的类型化错误对象
 * @param error 需要解析的错误，可以是直接错误对象或Promise拒绝的结果
 * @returns 返回解析后的错误对象，类型为泛型T（通常是预定义的API错误类型）
 * @example
 * try {
 *   // 尝试获取用户资料
 * } catch (error) {
 *   // 解析错误为特定API控制器的错误类型
 *   const err = await unwrapApiError<ApiErrors['profileController']['getProfile']>(error);
 *   // 根据错误代码执行相应操作
 *   if (err.code === 'SYSTEM_UNINITIALIZED') router.push('/setup');
 * }
 */
export async function unwrapApiError<T>(error: any): Promise<T> {
    if (error instanceof Promise) {
        return (await error) as T
    } else {
        return error as T
    }
}
