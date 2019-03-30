import React, { Component } from 'react'
import debounce from 'lodash/debounce'
import compare from 'react-fast-compare'

import Editor from '../components/Editor'
import { DocumentBlock } from '../constants'
import printer from '../helpers/printer'
import { mockedDocuments } from '../constants/mock-data'
import { renderDocuments } from '../helpers/render'

type MaTeXState = {
  documents: DocumentBlock[]
  pdfObjectURL?: string
}

export default class MaTeX extends Component<{}, MaTeXState> {
  state: MaTeXState = {
    documents: mockedDocuments,
    pdfObjectURL: undefined
  }
  static emptyDocumentBlock: DocumentBlock = {
    markdown: ''
  }
  componentDidMount() {
    this.generatePDF()
    console.log(
      require('../helpers/render').renderDocuments(this.state.documents)
    )
    const contents = this.state.documents.map((d) =>
      require('../helpers/markdown').parse(d.markdown)
    )
    contents.forEach((i) => i.forEach((d: any) => console.log(d)))
  }
  componentDidUpdate(_: {}, prevState: MaTeXState) {
    if (!compare(this.state.documents, prevState.documents)) {
      this.generatePDF()
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
  generatePDF = debounce(() => {
    const { documents } = this.state
    const content = renderDocuments(documents)
    printer(content).then((url) => {
      this.setState({
        pdfObjectURL: url
      })
    })
  }, 1000)
  render() {
    const { documents, pdfObjectURL } = this.state
    return <>
      <div className="documents">
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
      <iframe id="pdf" src={pdfObjectURL} frameBorder="0"></iframe>
    </>
  }
}
