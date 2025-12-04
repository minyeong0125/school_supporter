import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  try {
    if (req.method !== 'POST')
      return res.status(405).json({ message: 'Method Not Allowed' })

    const { courseCode, day } = req.body
    if (!courseCode || !day)
      return res.status(400).json({ message: 'courseCode and day required' })

    const client = await clientPromise
    const db = client.db('jbtimetable')
    const collection = db.collection('courses')

    const result = await collection.deleteOne({ courseCode, day })
    if (result.deletedCount && result.deletedCount > 0) {
      return res.status(200).json({ message: '삭제되었습니다' })
    }
    return res.status(404).json({ message: '찾는 과목이 없습니다' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: '서버 오류' })
  }
}
