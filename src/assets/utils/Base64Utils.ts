const MIMEMap: { [key: string]: string } = {
    'image/vnd.microsoft.icon': 'ico',
    'image/svg+xml': 'svg'
}

function base64ToFile(urlData: string) {
    // TODO 缺乏测试
    let arr = urlData.split(',')
    let mime = arr[0].match(/:(.*?);/)?.[1] || ''
    let bytes = atob(arr[1]) // 解码base64
    let n = bytes.length
    let ia = new Uint8Array(n)
    while (n--) {
        ia[n] = bytes.charCodeAt(n)
    }
    let extension = mime.split('/')[1]
    if (MIMEMap.hasOwnProperty(mime)) {
        extension = MIMEMap[mime]
    } else {
        console.error(`Unknown MIME type: ${mime}`)
    }
    let fileName = 'file_' + Date.now() + '.' + extension
    return new File([ia], fileName, { type: extension })
}

export { base64ToFile }
