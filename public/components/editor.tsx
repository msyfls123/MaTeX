import React, { Component } from 'react'
import SimpleMDE from 'react-simplemde-editor'

import { DocumentBlock } from '../constants'
import Image from './Image'

import 'easymde/dist/easymde.min.css'
import './Editor.styl'

type EditorProps = {
  onChange: (payload: Partial<DocumentBlock>) => void
  onRemove: () => void
  value?: DocumentBlock
}

export default class Editor extends Component<EditorProps> {
  render() {
    const { value, onChange } = this.props
    return <div className="document">
      <a onClick={() => {
        if (window.confirm('删除该文档块？')) {
          this.props.onRemove()
        }
      }} className="btn-remove">●</a>
      <SimpleMDE
        className="markdown-editor"
        value={value.markdown}
        onChange={(markdown) => onChange({markdown})}
        options={{
          autoDownloadFontAwesome: false,
          spellChecker: false,
          toolbar: [
            "bold",
            "italic",
            "code",
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
      <Image
        imgId={value.image}
        setImage={(image) => onChange({image})}
      />
    </div>
  }
}
