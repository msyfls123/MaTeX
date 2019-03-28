// no in use


// @ts-ignore
import PDFPrinter from 'pdfmake'
import { Response } from 'express'
import path from 'path'

const fontPath = path.join(__dirname, '..', 'fonts')

const fontDescriptors = {
  SourceHanSans: {
    'normal': path.join(fontPath, 'SourceHanSansCN-Regular.ttf'),
    'bold': path.join(fontPath, 'SourceHanSansCN-Bold.ttf'),
    'italics': path.join(fontPath, 'SourceHanSansCN-Regular.ttf'),
    'bolditalics': path.join(fontPath, 'SourceHanSansCN-Bold.ttf'),
  }
}

export default function printer(res: Response) {
  const printer = new (PDFPrinter as any)(fontDescriptors)
  const docDefinition = {
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
          width: [200, '*'],
          body: [
            [{
              image: 'media/arkdome.jpg',
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
  const doc = printer.createPdfKitDocument(docDefinition)
  doc.pipe(res)
  doc.end()
}
