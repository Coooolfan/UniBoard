import { useToast } from 'primevue/usetoast'

export function useClipboard() {
  const toast = useToast()
  
  async function copyToClipboard(content: string, successMessage: string, errorMessage: string) {
    try {
      const clipboard = window.navigator.clipboard
      if (!clipboard) throw new Error('剪切版读写仅在安全上下文（HTTPS）中可用')
      await clipboard.writeText(content)
      toast.add({
        severity: 'success',
        summary: '复制成功',
        detail: successMessage,
        life: 3000
      })
    } catch (error) {
      console.log('The short url is', content)
      toast.add({
        severity: 'error',
        summary: '复制失败',
        detail: error instanceof Error ? error.message : errorMessage || '未知错误',
        life: 10000
      })
    }
  }

  return {
    copyToClipboard
  }
}
