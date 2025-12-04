import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import { Collection } from 'mongodb'

interface Course {
  _id?: string
  courseCode: string
  name: string
  day: string
  timeStart: string
  timeEnd: string
  location: string
  professor: string
  rawLecture?: string
}

interface Schedule {
  userId: string
  courses: Course[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string } | Schedule | { message: string }>
) {
  try {
    const client = await clientPromise
    const db = client.db('jbtimetable')
    const collection: Collection<Schedule> = db.collection('schedules')

    if (req.method === 'POST') {
      // Save schedule
      const { userId, courses } = req.body
      if (!userId || !courses) {
        return res
          .status(400)
          .json({ message: 'userId and courses are required' })
      }

      await collection.replaceOne(
        { userId },
        { userId, courses },
        { upsert: true }
      )

      res.status(200).json({ message: 'Schedule saved successfully' })
    } else if (req.method === 'GET') {
      // Load schedule
      const { userId } = req.query
      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: 'userId is required' })
      }

      const schedule = await collection.findOne({ userId })
      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' })
      }

      res.status(200).json(schedule)
    } else {
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Database operation failed' })
  }
}
