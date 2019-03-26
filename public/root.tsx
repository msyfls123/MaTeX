import React from 'react'
import { hot } from 'react-hot-loader/root'

import Editor from './components/editor'

function Root() {
  return (
    <div>
      <Editor/>
    </div>
  )
}

export default hot(Root)
