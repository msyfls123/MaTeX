import React from 'react'
import { hot } from 'react-hot-loader/root'

import Markdown from './containers/MaTeX'

function Root() {
  return (
    <>
      <Markdown/>
    </>
  )
}

export default hot(Root)
