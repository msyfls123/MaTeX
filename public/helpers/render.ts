import Token from 'markdown-it/lib/token'
import { Content, Table } from 'pdfmake/build/pdfmake'
import cloneDeep from 'lodash/cloneDeep'
import without from 'lodash/without'
import chunk from 'lodash/chunk'

import { DocumentBlock } from '../constants'
import { BLOCK_STYLE, tableLayouts } from '../constants/styles'
import { parse } from './markdown'

export function renderDocuments(documents: DocumentBlock[]) {
  return documents.map((d) => {
    if (d.image) {
      return {
        columns: [
          { stack: renderBlocks(parse(d.markdown)), width: '*' },
          { image: d.image, fit: [260, 400], width: 260 },
        ],
        columnGap: 10,
        style: [BLOCK_STYLE],
      }
    } else {
      return {
        stack: renderBlocks(parse(d.markdown)),
        style: [BLOCK_STYLE],
      }
    }
  })
}

export function render(
  documents: DocumentBlock[],
  title: string,
  description: string[][],
): Content[] {
  const contents = []
  if (title) {
    contents.push({
      text: title,
      style: ['block', 'h1'],
    })
  }
  const filteredDescription = description.filter((d) => !!d.join(''))
  if (filteredDescription.length) {
    contents.push({
      table: {
        widths: [70, 70, 70, '*'],
        body: cloneDeep(filteredDescription),
      } as unknown as Table,
      layout: tableLayouts.description,
      style: ['table', 'description'],
    })
  }
  contents.push(renderDocuments(documents))
  return contents
}

export function renderBlocks(tokens: Token[]): Content[] {
  let styles: string[] = [BLOCK_STYLE]
  const contents: Content[] = []
  let inBulletList: boolean = false
  let inOrderedList: boolean = false
  let ul: Content[] = []
  let ol: Content[] = []
  let inTable: boolean = false
  let table: Content[] = []
  let tableColumnCount = 0

  const getContainer = () => {
    if (inTable) {
      return table
    } else if (inBulletList) {
      return ul
    } else if (inOrderedList) {
      return ol
    } else {
      return contents
    }
  }

  tokens.forEach((token) => {
    switch (token.type) {
      case 'inline':
        const blockStyles = styles.slice()
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
        styles.push('blockquote')
        break
      case 'blockquote_close':
        styles = without(styles, 'blockquote')
        break
      case 'bullet_list_open':
        inBulletList = true
        break
      case 'bullet_list_close':
        inBulletList = false
        contents.push({
          ul: cloneDeep(ul),
          style: 'ul',
        })
        ul = []
        break
      case 'ordered_list_open':
        inOrderedList = true
        break
      case 'ordered_list_close':
        inOrderedList = false
        contents.push({
          ol: cloneDeep(ol),
          style: 'ol',
        })
        ol = []
        break
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
            body: cloneDeep(chunk(table, tableColumnCount)),
          },
          style: 'table',
        })
        table = []
        tableColumnCount = 0
        break
      case 'hr':
        contents.push({
          text: '',
          pageBreak: 'after'
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
