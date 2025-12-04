'use client'

import { useState } from 'react'

type Course = {
  courseCode: string
  name: string
  day: string
  timeStart: string
  timeEnd: string
  location: string
  professor: string
}

export default function UploadPage() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [rows, setRows] = useState<Course[]>([])
  const [message, setMessage] = useState<string | null>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFileName(f.name)

    try {
      // dynamic import of xlsx to avoid build-time error when package not installed
      const XLSX = await import('xlsx')
      const data = await f.arrayBuffer()
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const json = XLSX.utils.sheet_to_json(sheet)
      // map to Course (best-effort)
      const parsed = (json as any[]).map((r) => ({
        courseCode: r['courseCode'] || r['과목코드'] || r['code'] || '',
        name: r['name'] || r['과목명'] || r['title'] || '',
        day: r['day'] || r['요일'] || '월',
        timeStart: r['timeStart'] || r['start'] || '09:00',
        timeEnd: r['timeEnd'] || r['end'] || '10:15',
        location: r['location'] || r['장소'] || '',
        professor: r['professor'] || r['교수'] || '',
      })) as Course[]
      setRows(parsed)
      setMessage('파일 파싱 완료. 미리보기 확인 후 삽입하세요.')
    } catch (err: any) {
      setMessage('xlsx 라이브러리 필요: `npm install xlsx`')
      console.error(err)
    }
  }

  const insertAll = async () => {
    if (rows.length === 0) return
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rows),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error')
      setMessage('삽입 성공')
    } catch (err: any) {
      setMessage(err.message || '오류 발생')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>엑셀 업로드 (과목 삽입)</h2>
      <p>엑셀 파일에서 과목 정보를 읽어 와 미리보기 후 삽입합니다.</p>
      <input type="file" accept=".xlsx,.xls" onChange={handleFile} />
      {fileName && <p>파일: {fileName}</p>}
      {message && <p>{message}</p>}
      {rows.length > 0 && (
        <div>
          <h3>미리보기 ({rows.length})</h3>
          <div style={{ maxHeight: 300, overflow: 'auto' }}>
            {rows.map((r, i) => (
              <div
                key={i}
                style={{ borderBottom: '1px solid #ddd', padding: 8 }}
              >
                <div>
                  <strong>{r.name}</strong> ({r.courseCode})
                </div>
                <div>
                  {r.professor} / {r.day} {r.timeStart}-{r.timeEnd}
                </div>
              </div>
            ))}
          </div>
          <button onClick={insertAll}>모두 삽입</button>
        </div>
      )}
    </div>
  )
}
