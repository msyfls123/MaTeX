import pdfMake from 'pdfmake/build/pdfmake'
// @ts-ignore
import pdfFonts from '../../fonts/vfs_fonts'
const image = require('!url-loader!../../media/arkdome.jpg')

import {
  fonts,
  styles,
  defaultStyle,
} from '../constants/styles'

let prevPdfObjectUrl: string

pdfMake.vfs = pdfFonts
pdfMake.fonts = fonts

export default function printer(content?: pdfMake.Content): Promise<{
  url: string
  pageIndex: number[]
}> {
  const docDefinition = {
    content: content || [
      {
        columns: [
          { text: [
            { text: 'aaa' },
            { text: 'bbb' },
          ], width: 200 },
          { text: '草草草草'.repeat(20), width: '*' },
        ],
        columnGap: 10,
        style: ['example', 'block'],
      },
      {
        style: 'tableExample',
        table: {
          width: [200, 'auto'],
          body: [
            [{
              image: image,
              fit: [200, 400],
            }, '擦擦擦'.repeat(150)],
          ]
        },
        layout: 'noBorders'
      },
      '123'
    ],
    defaultStyle,
    styles,
  }
  return new Promise((resolve) => {
    const doc = pdfMake.createPdf(docDefinition) as any
    doc.getBlob((blob: Blob) => {
      const pageIndex = doc.docDefinition.content.map((c: any) => c.positions[0].pageNumber)
      const url = URL.createObjectURL(blob)
      if (prevPdfObjectUrl) {
        URL.revokeObjectURL(prevPdfObjectUrl)
      }
      prevPdfObjectUrl = url
      resolve({
        url,
        pageIndex,
      })
    })
  })
}

