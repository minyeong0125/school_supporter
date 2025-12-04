import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs'

type Course = {
  courseCode: string
  name: string
  day: string
  timeStart: string
  timeEnd: string
  location: string
  professor: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Course[] | { message: string }>
) {
  try {
    const fileName = '붙임1.+2025학년도+2학기+개설교과목+현황(2025.07.21.기준).xlsx'
    const filePath = path.join(process.cwd(), fileName)
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: `엑셀 파일을 찾을 수 없습니다: ${fileName}` })
    }

    let XLSX: any
    try {
      XLSX = require('xlsx')
    } catch (err) {
      return res.status(500).json({ message: '서버에 `xlsx` 패키지가 설치되어 있지 않습니다. `npm install xlsx` 를 실행하세요.' })
    }

    const data = fs.readFileSync(filePath)
    const workbook = XLSX.read(data, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const json = XLSX.utils.sheet_to_json(sheet)

    const parsed = (json as any[]).map((r) => ({
      courseCode: r['과목코드'] || r['courseCode'] || r['code'] || '',
      name: r['교과목명'] || r['name'] || r['title'] || '',
      day: r['요일'] || r['day'] || '월',
      timeStart: r['시작시간'] || r['timeStart'] || r['start'] || '09:00',
      timeEnd: r['종료시간'] || r['timeEnd'] || r['end'] || '10:15',
      location: r['강의실'] || r['location'] || '',
      professor: r['교수명'] || r['professor'] || '',
    })) as Course[]

    return res.status(200).json(parsed)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: '엑셀 파싱 중 오류가 발생했습니다.' })
  }
}
