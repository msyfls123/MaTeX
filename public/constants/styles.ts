import { Style } from 'pdfmake/build/pdfmake'

export const fonts = {
  SourceHanSans: {
    'normal': 'SourceHanSansCN-Regular.ttf',
    'bold': 'SourceHanSansCN-Bold.ttf',
    'italics': 'SourceHanSansCN-Regular.ttf',
    'bolditalics': 'SourceHanSansCN-Bold.ttf',
  }
}

export const defaultStyle: Style = {
  font: 'SourceHanSans',
  fontSize: 11
}

export const BLOCK_STYLE = 'block'

export const STACK_TYPES = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
]

export const styles: Record<string, Style> = {
  [BLOCK_STYLE]: {
    margin: [0, 0, 0, 10],
  },
  h1: {
    fontSize: 24,
    bold: true,
  },
  h2: {
    fontSize: 20,
    bold: true
  },
  h3: {
    fontSize: 18,
    bold: true
  },
  h4: {
    fontSize: 16,
  },
  h5: {
    fontSize: 14,
  },
  h6: {
    fontSize: 12,
  },
  strong: {
    bold: true,
  },
  em: {
    decoration: 'underline',
  },
  code: {
    color: 'red',
  },
  blockquote: {
    color: '#999',
    decoration: 'underline',
    decorationStyle: 'wavy',
    decorationColor: '#a9a9a9'
  },
  ul: {
    margin: [0, 10, 0, 10],
  },
  ol: {
    margin: [0, 10, 0, 10],
  },
  table: {
    margin: [0, 10, 0, 10],
    alignment: 'center'
  },
  code_block: {
    margin: [10, 10, 10, 10],
    color: '#a9a9a9',
  }
}
