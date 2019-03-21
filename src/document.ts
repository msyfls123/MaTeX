import * as PDFDocument from 'pdfkit'
import { Response } from 'express'

export default function document(res: Response) {
    const doc = new PDFDocument({
        autoFirstPage: false
    })
    doc.pipe(res)
    doc.addPage({
        margins: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        }
    })

    doc.font('fonts/SourceHanSansCN-Regular.ttf')

    const img = doc.openImage('media/arkdome.jpg')
    const imgHeight = img.height / img.width * 300
    doc.image(img, 0, 0, {width: 300})

    doc.fontSize(11)
    const textOptions = ['大蛋是本喵，本喵是大蛋。1%abc '.repeat(30), 300, 0]
    const textHeight = doc.heightOfString(...textOptions)
    doc.text(...textOptions)
    doc.text('喵喵喵', 0)
    doc.text(`${imgHeight} ${textHeight}`)
    doc.end()
}