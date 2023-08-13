export function fileToBlob(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (!e.target?.result) {
        reject(new Error('文件转换失败'))
        return
      }
      const blob = new Blob([e.target.result], { type: file.type })
      resolve(blob)
    }
    reader.onerror = (e) => {
      reject(e)
    }
    reader.readAsDataURL(file)
  })
}
export function ipfsToHttps(url: string) {
  return url.replace('ipfs://', 'https://ipfs.io/ipfs/')
}
