import React from 'react'
import { render } from 'react-dom'

import printer from './helpers/printer'
import Root from './root'
import './css/app.styl'

const root = document.getElementById('root')
const output = document.getElementById('output') as HTMLIFrameElement

// root.innerHTML = 'hello<br>'.repeat(10)

// const button = document.createElement('button')
// button.innerText = 'Refresh'
// button.addEventListener('click', refresh)

// const link = document.createElement('a')
// link.innerText = 'Download'
// link.download = 'hello.pdf'

// root.appendChild(button)
// root.appendChild(link)

function refresh() {
  printer().then((url) => {
    output.src = url
    // link.href = url
  })
}
refresh()

render(<Root/>, root)
