import React, { Component, ChangeEvent } from 'react'
import debounce from 'lodash/debounce'
import compare from 'react-fast-compare'

import Editor from '../components/Editor'
import { DocumentBlock } from '../constants'
import printer from '../helpers/printer'
import { mockedDocuments } from '../constants/mock-data'
import { renderDocuments, render } from '../helpers/render'
import { exportToJSON, loadFromJSON } from '../helpers/converter'
import { clearImages } from '../helpers/image'

import Header, { HeaderProps, emptyDescription } from '../components/Header'

type MaTeXState = {
  documents: DocumentBlock[]
  pdfObjectURL?: string
  pageIndex: number[]
  activeDocumentIndex: number
  autoPreview: boolean
  previewDelay: number
} & Pick<HeaderProps, 'title' | 'description'>

export default class MaTeX extends Component<{}, MaTeXState> {
  state: MaTeXState = {
    title: process.env.NODE_ENV === 'production' ? '' : '我是大蛋',
    description: [emptyDescription],
    documents: mockedDocuments,
    activeDocumentIndex: 0,
    pdfObjectURL: undefined,
    pageIndex: [],
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
    const content = render(documents, title, this.getFilteredDescription())
    printer(content).then(({ url, pageIndex}) => {
      this.setState({
        pdfObjectURL: url,
        pageIndex,
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
      ],
      activeDocumentIndex: index,
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
    return `${title || '[未命名]'}-${date}`
  }
  exportMe = () => {
    const { title, documents, description } = this.state
    exportToJSON({title, documents, description})
  }
  loadFile = (e: ChangeEvent) => {
    const file = (e.target as HTMLInputElement).files[0]
    const fr = new FileReader()
    if (file) {
      fr.onload = () => {
        try {
          loadFromJSON(JSON.parse(fr.result as string)).then((data) => {
            this.setState(data)
          })
        } catch (e) {
          alert(e)
        }
      }
      fr.readAsText(file)
    }
  }
  getFilteredDescription = () => {
    return this.state.description.filter((d) => !!d.join(''))
  }
  getActivePageIndex = () => {
    const { title, activeDocumentIndex } = this.state
    let offset = 0
    const filteredDescription = this.getFilteredDescription()
    if (title) { offset += 1 }
    if (filteredDescription.length) { offset += 1 }
    return offset + activeDocumentIndex
  }
  render() {
    const {
      documents,
      pdfObjectURL,
      title,
      description,
      autoPreview,
      previewDelay,
      pageIndex,
    } = this.state
    const activePageIndex = pageIndex[this.getActivePageIndex()] || 1
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
        <a
          href={pdfObjectURL}
          download={this.getDownloadName() + '.pdf'}
        >下载 PDF</a>
        <a
          href="javascript:;"
          onClick={this.exportMe}
        >下载 JSON</a>
        导入 JSON：
        <input
          type="file"
          onChange={this.loadFile}
        />
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
        <button
          onClick={() => {
            if(confirm('确认清除所有缓存图片？此操作不可逆！')) {
              clearImages()
            }
          }}
          style={{
            float: 'right'
          }}
        >清除所有缓存图片</button>
      </div>
      <iframe id="pdf" src={`${pdfObjectURL}#page=${activePageIndex}`} frameBorder="0"></iframe></div>
    </>
  }
}
