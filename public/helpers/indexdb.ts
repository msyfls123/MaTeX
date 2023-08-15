import { IMAGE_TABLE_KEY } from './image'

const DB_NAME = location.href

let db: IDBDatabase
let objectStore: IDBObjectStore

const DB_VERSION = 1

const dbRequest = window.indexedDB.open(DB_NAME, DB_VERSION)

dbRequest.onsuccess = function() {
  db = dbRequest.result
}

dbRequest.onupgradeneeded = function () {
  db = dbRequest.result
  if (!db.objectStoreNames.contains(IMAGE_TABLE_KEY)) {
    objectStore = db.createObjectStore(IMAGE_TABLE_KEY, {
      autoIncrement: true,
      keyPath: 'id',
    })
    objectStore.createIndex('id', 'id', {
      unique: true
    })
  }
}

function promisifyRequest<T = {}>(request: IDBRequest, useResult = false) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = useResult ? (e) => resolve((e.target as any).result) : () => resolve(undefined as T)
    request.onerror = reject
  })
}

export function add<T>(tableKey: string, data: any) {
  const request = db.transaction([tableKey], 'readwrite')
    .objectStore(tableKey)
    .add(data);
  return promisifyRequest<T>(request, true)
}

export function read<T>(tableKey: string, id: number) {
  const transaction = db.transaction([tableKey])
  const objectStore = transaction.objectStore(tableKey)
  const request = objectStore.get(id)
  return promisifyRequest<T>(request, true)
}

export function update(tableKey: string, id: number, data: any) {
  const request = db.transaction([tableKey], 'readwrite')
    .objectStore(tableKey)
    .put({ ...data, id })
  return promisifyRequest(request)
}

export function remove(tableKey: string, id: number) {
  const request = db.transaction([tableKey], 'readwrite')
    .objectStore(tableKey)
    .delete(id)
  return promisifyRequest(request)
}

export function clear(tableKey: string) {
  const request = db.transaction([tableKey], 'readwrite')
    .objectStore(tableKey)
    .clear()
  return promisifyRequest(request)
}
