import './css/app.styl'

const root = document.getElementById('root')
const output = document.getElementById('output') as HTMLIFrameElement

root.innerHTML = 'hello<br>'.repeat(10)

const button = document.createElement('button')
button.innerText = 'Refresh'
button.addEventListener('click', refresh)

const link = document.createElement('a')
link.innerText = 'Download'
link.download = 'hello.pdf'

root.appendChild(button)
root.appendChild(link)

let prevPdfObjectUrl: string

function refresh() {
  fetch('/pdf').then(
    res => res.blob()
  ).then((blob) => {
    const url = URL.createObjectURL(blob)
    if (prevPdfObjectUrl) {
      URL.revokeObjectURL(prevPdfObjectUrl)
    }
    output.src = url
    link.href = url
    prevPdfObjectUrl = url
  })
}
refresh()
