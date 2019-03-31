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
} & Pick<HeaderProps, 'title' | 'description'>

export default class MaTeX extends Component<{}, MaTeXState> {
  state: MaTeXState = {
    title: '',
    description: [emptyDescription],
    documents: mockedDocuments,
    pdfObjectURL: undefined,
    autoPreview: true,
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
  debounceGeneratePdf = debounce(this.generatePDF, 1000)
  componentDidUpdate(_: {}, prevState: MaTeXState) {
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
  addEmptyDocument = () => {
    this.setState({
      documents: this.state.documents.concat(MaTeX.emptyDocumentBlock)
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
  render() {
    const {
      documents,
      pdfObjectURL,
      title,
      description,
      autoPreview,
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
        <button onClick={this.generatePDF}>手动预览</button>
      </div>
      <div className="main"><div className="documents">
        <Header
          {...{title, description}}
          onChangeTitle={(title) => this.setState({title})}
          onChangeDescription={(description) => this.setState({description})}
        />
        {documents.map((d, i) => (
          <Editor
            key={`editor-${i}`}
            value={d}
            onChange={(payload) => this.updateDocument(i, payload)}
            onRemove={() => this.removeDocument(i)}
          />
        ))}
        <button onClick={this.addEmptyDocument}>
          + 文档块
        </button>
      </div>
      <iframe id="pdf" src={pdfObjectURL} frameBorder="0"></iframe></div>
    </>
  }
}
