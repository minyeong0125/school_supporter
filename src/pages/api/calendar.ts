// pages/api/calendar.ts (MongoDB 연결 및 데이터 로드 API)

import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import { Collection } from 'mongodb'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

// 과목 데이터의 타입 정의
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
  credits: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Course[] | { message: string }>
) {
  try {
    const client = await clientPromise
    const db = client.db()
    const collection: Collection<Course> = db.collection('courses')

    if (req.method === 'GET') {
      // **1. 모든 과목 데이터 조회 (MongoDB에서 먼저 시도)**
      const calendarData = await collection.find({}).toArray()

      if (calendarData.length > 0) {
        // MongoDB 데이터를 Course 형식으로 변환 (기본값 '0' 유지)
        const courses: Course[] = calendarData.map((record: any) => ({
          _id: record._id,
          courseCode: record['과목코드'] || '',
          name: record['과목명'] || '',
          day: record['강의시간'] ? record['강의시간'].split(' ')[0] : '',
          timeStart: record['강의시간']
            ? record['강의시간'].split(' ')[1]?.split('-')[0]?.trim() || ''
            : '',
          timeEnd: record['강의시간']
            ? record['강의시간'].split(' ')[1]?.split('-')[1]?.trim() || ''
            : '',
          location: record['강의실'] || '',
          professor: record['교원명'] || '',
          rawLecture: record['강의시간'] || '',
          credits: parseInt(record['학점'] || '0', 10),
        }))
        res.status(200).json(courses)
      } else {
        // **2. MongoDB에 데이터가 없으면 CSV 파일에서 읽기**
        console.log('MongoDB에 데이터가 없어 CSV 파일에서 읽습니다.')
        const csvPath = path.join(
          process.cwd(),
          '+2025학년도+2학기+개설교과목+현황(2025.07.21.기준).csv'
        )
        if (fs.existsSync(csvPath)) {
          const csvContent = fs.readFileSync(csvPath, 'utf8')
          const records = parse(csvContent, {
            columns: false,
            skip_empty_lines: true,
            delimiter: '\t',
            trim: true,
          })

          const courses: Course[] = records.slice(1).map((record: any[]) => {
            const lectureTime = record[11] || '' // Index 11: 강의시간
            let day = ''
            let timeStart = ''
            let timeEnd = ''
            if (lectureTime) {
              const parts = lectureTime.split(' ')
              if (parts.length >= 2) {
                day = parts[0]
                const timeRange = parts.slice(1).join(' ')
                const timeParts = timeRange.split('-')
                if (timeParts.length === 2) {
                  timeStart = timeParts[0].trim()
                  timeEnd = timeParts[1].trim()
                }
              }
            }

            // 🚨 최종 수정: Index 7 (학점)이 비어있으면 Index 8 (이론)의 값으로 폴백
            // 이로써 구조가 불안정한 행에서도 '2' 학점을 가져올 수 있습니다.
            const creditString = record[7] || record[8] || '0'

            return {
              courseCode: record[4] || '', // Index 4: 과목코드
              name: record[5] || '', // Index 5: 과목명
              day,
              timeStart,
              timeEnd,
              location: record[12] || '', // Index 12: 강의실
              professor: record[10] || '', // Index 10: 교원명
              rawLecture: lectureTime,
              credits: parseInt(creditString, 10),
            }
          })
          res.status(200).json(courses)
        } else {
          // CSV 파일도 없는 경우
          res.status(200).json([])
        }
      }
    } else if (req.method === 'POST') {
      // POST 요청 로직: 데이터 삽입 (기존과 동일)
      const dataToInsert = req.body
      if (!dataToInsert)
        return res.status(400).json({ message: '삽입할 데이터가 필요합니다.' })
      let insertedCount = 0
      if (Array.isArray(dataToInsert)) {
        const result = await collection.insertMany(dataToInsert)
        insertedCount = result.insertedCount
      } else {
        await collection.insertOne(dataToInsert as Course)
        insertedCount = 1
      }
      res.status(201).json({
        message: `데이터 삽입 성공: ${insertedCount}개`,
      } as any)
    } else {
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('MongoDB 연결 또는 조회 실패, CSV 파일에서 읽습니다.', error)
    // MongoDB 연결 실패 시 CSV 파일에서 읽기 (기존 로직과 동일)
    try {
      const csvPath = path.join(
        process.cwd(),
        '+2025학년도+2학기+개설교과목+현황(2025.07.21.기준).csv'
      )
      if (fs.existsSync(csvPath)) {
        const csvContent = fs.readFileSync(csvPath, 'utf8')
        const records = parse(csvContent, {
          columns: false,
          skip_empty_lines: true,
          delimiter: '\t', // 탭 구분자
          trim: true,
        })

        const courses: Course[] = records.slice(1).map((record: any[]) => {
          const lectureTime = record[11] || '' // Index 11: 강의시간
          let day = ''
          let timeStart = ''
          let timeEnd = ''
          if (lectureTime) {
            const parts = lectureTime.split(' ')
            if (parts.length >= 2) {
              day = parts[0]
              const timeRange = parts.slice(1).join(' ')
              const timeParts = timeRange.split('-')
              if (timeParts.length === 2) {
                timeStart = timeParts[0].trim()
                timeEnd = timeParts[1].trim()
              }
            }
          }
          // 🚨 최종 수정: Index 7 (학점)이 비어있으면 Index 8 (이론)의 값으로 폴백
          const creditString = record[7] || record[8] || '0'

          return {
            courseCode: record[4] || '', // Index 4: 과목코드
            name: record[5] || '', // Index 5: 과목명
            day,
            timeStart,
            timeEnd,
            location: record[12] || '', // Index 12: 강의실
            professor: record[10] || '', // Index 10: 교원명
            rawLecture: lectureTime,
            credits: parseInt(creditString, 10), // Index 7: 학점
          }
        })
        res.status(200).json(courses)
      } else {
        res.status(500).json({ message: 'CSV 파일을 찾을 수 없습니다.' })
      }
    } catch (csvError) {
      console.error('CSV 파싱 오류:', csvError)
      res.status(500).json({ message: '데이터 로드 실패' })
    }
  }
}
