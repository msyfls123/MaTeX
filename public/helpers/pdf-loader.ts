import 'whatwg-fetch'

let prevPdfObjectUrl: string
export function loadPdf() {
  return fetch('/pdf').then(
    res => res.blob()
  ).then((blob) => {
    const url = URL.createObjectURL(blob)
    if (prevPdfObjectUrl) {
      URL.revokeObjectURL(prevPdfObjectUrl)
    }
    prevPdfObjectUrl = url
    return url
  })
}
