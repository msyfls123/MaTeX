import pdfMake from 'pdfmake/build/pdfmake'
// @ts-ignore
import pdfFonts from '../../fonts/vfs_fonts'
const image = require('!url-loader!../../media/arkdome.jpg')


let prevPdfObjectUrl: string

pdfMake.vfs = pdfFonts
pdfMake.fonts = {
  SourceHanSans: {
    'normal': 'SourceHanSansCN-Regular.ttf',
    'bold': 'SourceHanSansCN-Bold.ttf',
    'italics': 'SourceHanSansCN-Regular.ttf',
    'bolditalics': 'SourceHanSansCN-Bold.ttf',
  }
}

export default function printer(docDefinition?: pdfMake.TDocumentDefinitions): Promise<string> {
  docDefinition = docDefinition || {
    content: [
      {
        columns: [
          { text: 'aaa'.repeat(160), width: 200 },
          { text: '草草草草'.repeat(20), width: '*' },
        ],
        columnGap: 10,
        style: 'example',
      },
      {
        style: 'tableExample',
        table: {
          width: [200, 'auto'],
          body: [
            [{
              image: image,
              fit: [200, 200],
            }, '擦擦擦'.repeat(150)],
          ]
        },
        layout: 'noBorders'
      },
      '123'
    ],
    defaultStyle: {
      font: 'SourceHanSans',
    },
    styles: {
      tableExample: {
        margin: [0, 55, 0, 25],
        padding: [10, 10, 20, 20],
      },
      example: {
        color: '#64aeda',
        bold: true,
        fontSize: 18
      }
    },
  }
  return new Promise((resolve) => {
    const doc = pdfMake.createPdf(docDefinition) as any
    doc.getBlob((blob: Blob) => {
      const url = URL.createObjectURL(blob)
      if (prevPdfObjectUrl) {
        URL.revokeObjectURL(prevPdfObjectUrl)
      }
      prevPdfObjectUrl = url
      resolve(url)
    })
  })
}

