import { DocumentBlock } from '../constants'
import { preloadImages } from './image'
import { HeaderProps, emptyDescription } from '../components/Header'

type JSONDataType = {
  documents: DocumentBlock[]
} & Pick<HeaderProps, 'description' | 'title'>

function getExportTitle(title = '') {
  const now = new Date()
  const date = [now.getFullYear(), now.getMonth() + 1, now.getDay()].join('-')
  return `${title || '[未命名]'}-${date}`
}

export function exportToJSON(data: JSONDataType) {
  const jsonData = JSON.stringify(data)
  const blob = new Blob([jsonData], {type: 'application/json'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a');
  a.href        = url
  a.download    = getExportTitle(data.title) + '.json'
  a.click()
}

export function loadFromJSON(
  data: JSONDataType
) {
  const { title, documents, description = [emptyDescription] } = data
  return Promise.all(
    preloadImages(documents.map((d) => d.image))
  ).then((list: Array<number | undefined>) => {
    const resDocuments = documents.reduce((acc, d) => {
      if (list.includes(d.image)) {
        acc.push(d)
      } else {
        const { image, ...rest } = d
        acc.push(rest)
      }
      return acc
    }, [] as DocumentBlock[])
    return {
      title,
      documents: resDocuments,
      description,
    }
  })
}
