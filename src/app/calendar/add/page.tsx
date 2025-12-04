'use client'

import { useState } from 'react'

interface CourseForm {
  courseCode: string
  name: string
  day: string
  timeStart: string
  timeEnd: string
  location: string
  professor: string
}

export default function AddCoursePage() {
  const [form, setForm] = useState<CourseForm>({
    courseCode: '',
    name: '',
    day: '월',
    timeStart: '09:00',
    timeEnd: '10:15',
    location: '',
    professor: '',
  })
  const [message, setMessage] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error')
      setMessage('과목 추가 성공')
      setForm({
        courseCode: '',
        name: '',
        day: '월',
        timeStart: '09:00',
        timeEnd: '10:15',
        location: '',
        professor: '',
      })
    } catch (err: any) {
      setMessage(err.message || '오류 발생')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>과목 추가</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
        <div style={{ marginBottom: 8 }}>
          <label>과목코드</label>
          <input
            name="courseCode"
            value={form.courseCode}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>과목명</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>요일</label>
          <select name="day" value={form.day} onChange={handleChange}>
            <option>월</option>
            <option>화</option>
            <option>수</option>
            <option>목</option>
            <option>금</option>
            <option>토</option>
            <option>일</option>
          </select>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>시작시간</label>
          <input
            name="timeStart"
            value={form.timeStart}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>종료시간</label>
          <input name="timeEnd" value={form.timeEnd} onChange={handleChange} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>장소</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>교수</label>
          <input
            name="professor"
            value={form.professor}
            onChange={handleChange}
          />
        </div>
        <button type="submit">추가</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}
