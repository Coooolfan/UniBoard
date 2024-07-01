function base64ToFile(urlData: any) {
    // TODO 要修一下的
    
    let arr = urlData.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let bytes = atob(arr[1]) // 解码base64
    let n = bytes.length
    let ia = new Uint8Array(n)
    while (n--) {
        ia[n] = bytes.charCodeAt(n)
    }
    let fileName = 'file_' + Date.now() + '.' + mime.split('/')[1]
    return new File([ia], fileName, { type: mime })
}


export { base64ToFile }