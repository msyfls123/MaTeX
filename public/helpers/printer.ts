import pdfMake from 'pdfmake/build/pdfmake'
import { Content } from 'pdfmake/interfaces'

// @ts-ignore
import pdfFonts from '../../fonts/vfs_fonts'
import {
  defaultStyle,
  fonts,
  styles,
} from '../constants/styles'

const image = require('!url-loader!../../media/arkdome.jpg')


let prevPdfObjectUrl: string

pdfMake.vfs = pdfFonts
pdfMake.fonts = fonts

export default function printer(content?: Content): Promise<{
  url: string
  pageIndex: number[]
}> {
  const docDefinition = {
    content: content!,
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
