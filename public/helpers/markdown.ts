import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

export function parse(text: string) {
  return md.parse(text, {})
}
