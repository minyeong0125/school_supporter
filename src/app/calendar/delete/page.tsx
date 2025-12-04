'use client'

import { useState } from 'react'

export default function DeleteCoursePage() {
  const [courseCode, setCourseCode] = useState('')
  const [day, setDay] = useState('월')
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/calendar/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseCode, day }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error')
      setMessage('삭제 성공')
    } catch (err: any) {
      setMessage(err.message || '오류 발생')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>과목 삭제</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>과목코드</label>
          <input
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
          />
        </div>
        <div>
          <label>요일</label>
          <select value={day} onChange={(e) => setDay(e.target.value)}>
            <option>월</option>
            <option>화</option>
            <option>수</option>
            <option>목</option>
            <option>금</option>
            <option>토</option>
            <option>일</option>
          </select>
        </div>
        <button type="submit">삭제</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}
