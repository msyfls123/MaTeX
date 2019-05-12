import {
  add,
  remove,
  read,
  clear,
} from './indexdb'
let uuid = 0

export const IMAGE_TABLE_KEY = 'matex-image'
export const IMAGE_DATAURI_KEY = 'data-uri'

const images: Record<number, string> = {}

type ImageType = {
  id: number
  'data-uri': string
}

export function addImage(image: string) {
  return add<number>(IMAGE_TABLE_KEY, {
    [IMAGE_DATAURI_KEY]: image
  }).then((id) => {
    images[id] = image
    return id
  })
}

export function getImage(uuid: number) {
  return images[uuid]
}

export function removeImage(uuid: number) {
  images[uuid] = undefined
  remove(IMAGE_TABLE_KEY, uuid)
}

export function clearImages() {
  clear(IMAGE_TABLE_KEY)
}

export function preloadImages(ids: number[]) {
  return ids.filter(id => !!id).map((id) => {
    return read(IMAGE_TABLE_KEY, id).then((data: ImageType) => {
      if (data) {
        images[id] = data[IMAGE_DATAURI_KEY]
        return id
      }
    }, () => undefined)
  })
}
