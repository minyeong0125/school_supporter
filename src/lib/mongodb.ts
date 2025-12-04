// lib/mongodb.ts

import { MongoClient } from 'mongodb'
import mongoose from 'mongoose'

// .env.local 파일에서 MongoDB URI를 가져옵니다.
const uri = process.env.MONGODB_URI
// .env.local에 정의된 MONGODB_URI가 없다면 오류를 발생시킵니다.
if (!uri) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// 개발 환경에서는 글로벌 변수를 사용하여 재사용합니다. (Next.js HMR 대응)
if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    // @ts-ignore
    global._mongoClientPromise = client.connect()
  }
  // @ts-ignore
  clientPromise = global._mongoClientPromise
} else {
  // 프로덕션 환경에서는 글로벌 변수를 사용하지 않습니다.
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

// 이 clientPromise를 /pages/api/*.ts 파일에서 import 하여 사용합니다.
export default clientPromise

//성혜
const MONGODB_URI = process.env.MONGODB_URI!

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return
  return mongoose.connect(MONGODB_URI, { dbName: 'school-supporter' })
}
