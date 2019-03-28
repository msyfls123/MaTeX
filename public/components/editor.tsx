import React, { Component } from 'react'
import SimpleMDE from 'react-simplemde-editor'

import { parse } from '../helpers/markdown'


import 'easymde/dist/easymde.min.css'
import './editor.styl'

export default class Editor extends Component {
  render() {
    return (
      <SimpleMDE
        className="markdown-editor"
        onChange={(t) => console.log(parse(t))}
        options={{
          autoDownloadFontAwesome: false,
          spellChecker: false,
          toolbar: [
            "bold",
            "italic",
            "heading",
            "|",
            "quote",
            "unordered-list",
            "ordered-list",
            "|",
            "link",
            "horizontal-rule",
            "|",
            "guide",
          ],
        }}
      />
    )
  }
}
