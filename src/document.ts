import PDFDocument from 'pdfkit'

type TextOptions = PDFKit.Mixins.TextOptions
type Texts = Array<{
  text: string,
  options: TextOptions
}>

export default class EnhancedPDFDocument extends PDFDocument {
  _lineGap?: number
  _initOptions: (options: TextOptions) => any
  _text: (text: string, x: number, y: number, options: TextOptions, line:() => void) => number
  [x: string]: any;
  constructor(options: PDFKit.PDFDocumentOptions) {
    super(options)
  }
  heightOfTexts(texts: Texts) {
    const { x, y } = this;

    texts.forEach(({ text, options }) => {
      options = this._initOptions(options);
      options.height = Infinity; // don't break pages

      const lineGap = options.lineGap || this._lineGap || 0;
      this._text(text, this.x, this.y, options, () => {
        return (this.y += this.currentLineHeight(true) + lineGap);
      });
    })

    const height = this.y - y;
    this.x = x;
    this.y = y;

    return height;
  }
  texts(texts: Texts) {
    texts.forEach(({ text, options }) => {
      this.text(text, options)
    })
  }
  moveCursorTo(x?: number, y?: number) {
    if (typeof x !== undefined) { this.x = x }
    if (typeof y !== undefined) { this.y = y }
    return this
  }
}
