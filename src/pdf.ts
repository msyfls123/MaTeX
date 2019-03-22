import PDFDocument from './document'
import { Response } from 'express'

const exampleText = '大蛋是本喵，本喵是大蛋。1%abc '
const texts = [
  { text: exampleText, options: { continued: true, oblique: true }},
  { text: exampleText, options: { continued: true, oblique: false, underline: true }},
  { text: exampleText, options: { continued: true, underline: false, link: 'https://douban.com'}},
  { text: exampleText, options: { continued: true, stroke: true, link: null, fill: true }},
  { text: exampleText, options: { continued: true, stroke: false, underline: true }},
  { text: exampleText, options: { underline: false, link: 'https://douban.com'}},
]

export default function document(res: Response) {
    const doc = new PDFDocument({
        margins: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        }
    })
    doc.pipe(res)

    doc.font('fonts/SourceHanSansCN-Regular.ttf')

    const img = doc.openImage('media/arkdome.jpg')
    const imgHeight = img.height / img.width * 300
    doc.image(img, 0, 0, {width: 300})

    doc.fontSize(18)
    doc.moveCursorTo(300, 0)
    const textHeight = doc.heightOfTexts(texts)
    doc.texts(texts)
    doc.text('喵喵喵', 0)
    doc.text(`${imgHeight} ${textHeight}`)
    doc.end()
}
