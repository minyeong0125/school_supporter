import { MongoClient } from 'mongodb'

let client: MongoClient
let clientPromise: Promise<MongoClient>

const uri = process.env.MONGODB_URI || '' // 환경변수에 MongoDB URI
const options = {}

if (!uri) throw new Error('Please add your Mongo URI to .env.local')

if (process.env.NODE_ENV === 'development') {
  // 개발 모드에서 글로벌 캐싱
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options)
    ;(global as any)._mongoClientPromise = client.connect()
  }
  clientPromise = (global as any)._mongoClientPromise
} else {
  // 배포 모드
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function connectToDB() {
  const client = await clientPromise
  const db = client.db('school-supporter') // MongoDB DB명
  return db
}
