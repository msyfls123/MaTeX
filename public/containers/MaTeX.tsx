import React, { Component } from 'react'
import debounce from 'lodash/debounce'
import compare from 'react-fast-compare'

import Editor from '../components/Editor'
import { DocumentBlock } from '../constants'
import printer from '../helpers/printer'
import { mockedDocuments } from '../constants/mock-data'
import { renderDocuments, render } from '../helpers/render'

import Header, { HeaderProps, emptyDescription } from '../components/Header'

type MaTeXState = {
  documents: DocumentBlock[]
  pdfObjectURL?: string
  autoPreview: boolean
  previewDelay: number
} & Pick<HeaderProps, 'title' | 'description'>

export default class MaTeX extends Component<{}, MaTeXState> {
  state: MaTeXState = {
    title: process.env.NODE_ENV === 'production' ? '' : '我是大蛋',
    description: [emptyDescription],
    documents: mockedDocuments,
    pdfObjectURL: undefined,
    autoPreview: true,
    previewDelay: 3,
  }
  static emptyDocumentBlock: DocumentBlock = {
    markdown: ''
  }
  componentDidMount() {
    this.generatePDF()
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        renderDocuments(this.state.documents)
      )
      const contents = this.state.documents.map((d) =>
        require('../helpers/markdown').parse(d.markdown)
      )
      contents.forEach((i) => i.forEach((d: any) => console.log(d)))
    }
  }
  generatePDF = () => {
    const { documents, title, description } = this.state
    const content = render(documents, title, description)
    printer(content).then((url) => {
      this.setState({
        pdfObjectURL: url
      })
    })
  }
  debounceGeneratePdf = debounce(this.generatePDF, 3000)
  componentDidUpdate(_: {}, prevState: MaTeXState) {
    // compare is needless
    if (
      this.state.autoPreview && (
        !compare(this.state.documents, prevState.documents) ||
        this.state.title !== prevState.title ||
        !compare(this.state.description, prevState.description)
      )
    ) {
      this.debounceGeneratePdf()
    }
  }
  addEmptyDocument = (index: number) => {
    const { documents } = this.state
    this.setState({
      documents: [
        ...documents.slice(0, index+1),
        MaTeX.emptyDocumentBlock,
        ...documents.slice(index+1),
      ]
    })
  }
  updateDocument = (index: number, payload: Partial<DocumentBlock>) => {
    const { documents } = this.state
    this.setState({
      documents: [
        ...documents.slice(0, index),
        {...documents[index], ...payload},
        ...documents.slice(index+1)
      ]
    })
  }
  removeDocument = (index: number) => {
    const { documents } = this.state
    this.setState({
      documents: [
        ...documents.slice(0, index),
        ...documents.slice(index+1)
      ]
    })
  }
  getDownloadName = () => {
    const { title } = this.state
    const now = new Date()
    const date = [now.getFullYear(), now.getMonth() + 1, now.getDay()].join('-')
    return `${title || '[未命名]'}-${date}.pdf`
  }
  render() {
    const {
      documents,
      pdfObjectURL,
      title,
      description,
      autoPreview,
      previewDelay,
    } = this.state
    return <>
      <div
        className="auto-preview"
      >
        <label><input
          type="checkbox"
          checked={autoPreview}
          onChange={() => this.setState({
            autoPreview: !autoPreview
          })}
        />
        自动预览</label>
        {/* （延时 <input
          className="preview-delay"
          type="number"
          min={1}
          step={1}
          value={previewDelay}
          disabled={!autoPreview}
          onChange={(e) => this.setState({previewDelay: +e.target.value})}
        /> 秒） */}
        <button onClick={this.generatePDF}>手动预览</button>
        <a href={pdfObjectURL} download={this.getDownloadName()}>下载</a>
      </div>
      <div className="main"><div className="documents">
        <Header
          {...{title, description}}
          onChangeTitle={(title) => this.setState({title})}
          onChangeDescription={(description) => this.setState({description})}
        />
        {documents.map((d, i) => <div key={i}>
          <Editor
            value={d}
            onChange={(payload) => this.updateDocument(i, payload)}
            onRemove={() => this.removeDocument(i)}
          />
          <button onClick={() => this.addEmptyDocument(i)}>
            + 文档块
          </button>
        </div>)}
      </div>
      <iframe id="pdf" src={pdfObjectURL+"#page=1"} frameBorder="0"></iframe></div>
    </>
  }
}
