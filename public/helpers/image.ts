let uuid = 0

const images: Record<number, string> = {}

export function addImage(image: string) {
  images[uuid] = image
  return uuid++
}

export function getImage(uuid: number) {
  return images[uuid]
}
