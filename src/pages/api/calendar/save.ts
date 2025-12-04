import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'
import { Collection } from 'mongodb'
import fs from 'fs'
import path from 'path'
// Removed: import { Scheduler } from 'timers/promises' // This import was unused and has been removed.

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

interface Calendar {
  userId: string
  courses: Course[]
}

const SCHEDULES_FILE = path.join(process.cwd(), 'schedules.json')

// Helper function to read calendars from JSON file
function readCalendarsFromFile(): Record<string, Calendar> {
  try {
    if (fs.existsSync(SCHEDULES_FILE)) {
      const data = fs.readFileSync(SCHEDULES_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading schedules file:', error)
  }
  return {}
}

// Helper function to write calendars to JSON file
function writeCalendarsToFile(calendars: Record<string, Calendar>): void {
  try {
    fs.writeFileSync(SCHEDULES_FILE, JSON.stringify(calendars, null, 2))
  } catch (error) {
    console.error('Error writing calendars file:', error)
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string } | Calendar | { message: string }>
) {
  const useFileFallback = process.env.USE_FILE_STORAGE === 'true'

  try {
    if (!useFileFallback) {
      // Try MongoDB first
      console.log('Attempting to save to MongoDB...')
      const client = await clientPromise
      const db = client.db()
      console.log('Connected to database:', db.databaseName)
      // Collection 타입에 key가 포함된 Calendar를 사용합니다.
      const collection: Collection<Calendar> = db.collection('calendar')

      if (req.method === 'POST') {
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

        res.status(200).json({ message: 'Calendar saved successfully' })
      } else if (req.method === 'GET') {
        const { userId } = req.query
        if (!userId || typeof userId !== 'string') {
          return res.status(400).json({ message: 'userId is required' })
        }

        const calendar = await collection.findOne({ userId })
        if (!calendar) {
          return res.status(404).json({ message: 'Calendar not found' })
        }

        res.status(200).json(calendar)
      } else {
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
      }
    } else {
      throw new Error('Using file storage fallback')
    }
  } catch (error) {
    console.warn('DB 접근 오류, 로컬 JSON 파일로 폴백합니다.', error)

    // Fallback to JSON file storage
    const calendars = readCalendarsFromFile()

    if (req.method === 'POST') {
      const { userId, courses } = req.body
      if (!userId || !courses) {
        return res
          .status(400)
          .json({ message: 'userId and courses are required' })
      }

      calendars[userId] = { userId, courses }
      writeCalendarsToFile(calendars)

      res
        .status(200)
        .json({ message: 'Calendar saved successfully (file storage)' })
    } else if (req.method === 'GET') {
      const { userId } = req.query
      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: 'userId is required' })
      }

      const calendar = calendars[userId]
      if (!calendar) {
        return res.status(404).json({ message: 'Calendar not found' })
      }

      res.status(200).json(calendar)
    } else {
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  }
}
