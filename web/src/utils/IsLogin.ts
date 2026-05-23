/**
 * 检查用户当前的登录状态
 * @returns {boolean} 如果用户已登录返回 true，否则返回 false
 */
export function isLoggedIn(): boolean {
    // 获取所有 cookie
    const cookies = document.cookie.split(';');
    
    // 查找名为 satoken 的 cookie
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // 检查 cookie 是否以 "satoken=" 开头
      if (cookie.startsWith('satoken=')) {
        const token = cookie.substring('satoken='.length);
        // 如果 token 存在且不为空，则认为用户已登录
        return token !== null && token !== '';
      }
    }
    
    // 如果没有找到 satoken cookie 或 token 为空，则认为用户未登录
    return false;
  }