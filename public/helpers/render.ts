import chunk from 'lodash/chunk'
import cloneDeep from 'lodash/cloneDeep'
import without from 'lodash/without'
import Token from 'markdown-it/lib/token'
import { Content, Table } from 'pdfmake/interfaces'

import { DocumentBlock } from '../constants'
import { BLOCK_STYLE, tableLayouts } from '../constants/styles'
import { getImage } from './image'
import { parse } from './markdown'

export function renderDocuments(documents: DocumentBlock[]) {
  return documents.map((d, i) => {
    if (typeof d.image !== 'undefined') {
      return {
        columns: [
          { stack: renderBlocks(parse(d.markdown)), width: '*' },
          { image: getImage(d.image), fit: [240, 400], width: 240 },
        ],
        columnGap: 20,
        style: ['document'] as any,
      } as any
    } else {
      return {
        stack: renderBlocks(parse(d.markdown)),
        style: ['document'] as any,
      }
    }
  })
}

export function render(
  documents: DocumentBlock[],
  title: string,
  description: string[][],
): Content[] {
  const contents: Content[] = []
  if (title) {
    contents.push({
      text: title,
      style: ['block', 'h1'] as any,
    })
  }
  if (description.length) {
    contents.push({
      table: {
        widths: [70, 70, 70, '*'],
        body: cloneDeep(description),
      } as unknown as Table,
      layout: tableLayouts.description,
      style: ['description'] as any,
    })
  }
  return contents.concat(renderDocuments(documents))
}

export function renderBlocks(tokens: Token[]): Content[] {
  let styles: string[] = [BLOCK_STYLE]
  const contents: Content[] = []
  let inList = false
  let list: Content[] = []
  let currListIndex: any[] = []
  let inTable: boolean = false
  let table: Content[] = []
  let tableColumnCount = 0

  const getContainer = () => {
    if (inTable) {
      return table
    } else if (inList) {
      return currListIndex.reduce((acc, key) => acc[key], list)
    } else {
      return contents
    }
  }

  tokens.forEach((token) => {
    switch (token.type) {
      case 'inline':
        const blockStyles = styles.slice() as any
        const container = getContainer()
        container.push({
          text: renderInline(token.children),
          style: container === contents ? blockStyles as any : undefined,
        })
        break
      case 'heading_open':
        styles.push(token.tag) // h1 - h6
        break
      case 'heading_close':
        styles = without(styles, token.tag)
        break
      case 'blockquote_open':
        styles = without(styles, 'block')
        styles.push('blockquote')
        break
      case 'blockquote_close':
        styles.push('block')
        styles = without(styles, 'blockquote')
        break
      // list start
      case 'bullet_list_open':
      case 'ordered_list_open':
        inList = true
        if (token.level) {
          const listContainer = getContainer()
          const tag = token.tag // ul, ol
          listContainer.push({ [tag]: [], style: 'list' })
          currListIndex.push(listContainer.length - 1)
          currListIndex.push(tag)
        }
        break
      case 'list_item_open':
        const listContainer1 = getContainer()
        listContainer1.push([])
        currListIndex.push(listContainer1.length - 1)
        break
      case 'list_item_close':
        currListIndex.pop()
        break
      case 'bullet_list_close':
      case 'ordered_list_close':
        if (currListIndex.length) {
          currListIndex.pop()
          currListIndex.pop()
        } else {
          inList = false
          getContainer().push({
            [token.tag]: cloneDeep(list),
            style: BLOCK_STYLE
          })
          list = []
          currListIndex = []
        }
        break
      // list end
      case 'table_open':
        inTable = true
        break
      case 'thead_close':
        tableColumnCount = table.length
        break
      case 'table_close':
        inTable = false
        contents.push({
          table: {
            headerRows: 1,
            body: cloneDeep(chunk(table, tableColumnCount)),
          },
          layout: tableLayouts.table,
          style: 'table',
        })
        table = []
        tableColumnCount = 0
        break
      case 'hr':
        contents.push({
          text: '',
          pageBreak: 'before'
        })
        break
      case 'fence':
        contents.push({
          stack: renderInline(token.content.split('\n').map((t) => ({
            type: 'text',
            content: t
          }) as Token)),
          style: 'code_block',
        })
        break
      default:
        break
    }
  })
  return contents
}

function renderInline(
  tokens: Token[],
): Content[] {
  let styles: Array<string | { link: string }> = []
  const contents: Content[] = []
  const pushContent = (token: Token) => {
    contents.push({
      style: styles.slice() as any,
      text: token.content,
    })
  }

  tokens.forEach((token) => {
    switch (token.type) {
      case 'text':
        pushContent(token)
        break
      case 'softbreak':
        contents.push({
          text: '\n',
        })
        break
      case 'strong_open':
        styles.push('strong')
        break
      case 'strong_close':
        styles = without(styles, 'strong')
        break
      case 'em_open':
        styles.push('em')
        break
      case 'em_close':
        styles = without(styles, 'em')
        break
      case 'code_inline':
        styles.push('code')
        pushContent(token)
        styles = without(styles, 'code')
        break
      case 'link_open':
        styles.push({
          link: token.attrs[0][1],
          color: 'blue',
          decoration: 'underline',
        } as any)
        break
      case 'link_close':
        const link_index = styles.findIndex((s) => !!s.link)
        if (link_index > -1) {
          styles = [
            ...styles.slice(0, link_index),
            ...styles.slice(link_index+1)
          ]
        }
        break
      default:
        break
    }
  })
  return contents
}
