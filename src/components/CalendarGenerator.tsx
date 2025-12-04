'use client'

// components/CalendarGenerator.tsx

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'

// --- 1. 타입 및 상수 정의 ---
interface Course {
  _id?: string
  courseCode: string
  name: string
  day: string
  timeStart: string
  timeEnd: string
  location: string
  professor: string
  rawLecture?: string // 💡 추가된 속성: 학점 및 색상
  credits: number
  color?: string
}

const DAYS = ['월', '화', '수', '목', '금', '토', '일']
const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => {
  const h = 9 + i
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(h)}:00-${pad(h + 1)}:00`
})

// 💡 과목별 색상을 위한 배열 추가
const COURSE_COLORS = [
  '#81D4FA', // Light Blue
  '#A5D6A7', // Light Green
  '#FFAB91', // Light Orange
  '#FFCC80', // Light Amber
  '#E6EE9C', // Lime
  '#B39DDB', // Light Purple
  '#F48FB1', // Pink
  '#B0BEC5', // Blue Grey
]

const parseValueFromTime = (t: string): number | null => {
  if (!t) return null
  t = t.trim()
  const mRange = t.match(/(\d{1,2}):?(\d{2})?\s*[-~–]\s*(\d{1,2}):?(\d{2})?/)
  if (mRange) return parseInt(mRange[1], 10)
  const m = t.match(/^(\d{1,2}):?(\d{2})?$/)
  if (m) return parseInt(m[1], 10)
  const num = t.match(/^\d{1,2}$/)
  if (num) return parseInt(num[0], 10)
  return null
}

const cleanProfessorName = (professor: string): string => {
  return professor.replace(/[()]/g, '').trim()
}

// --- 2. 스타일 정의 ---
const cellHeight = '80px'

const mainContainerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 20px',
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: '700px',
  tableLayout: 'fixed',
}

const cellStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  padding: '10px',
  verticalAlign: 'top',
  wordBreak: 'break-word',
}

const searchResultsContainerStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  maxHeight: '300px',
  overflowY: 'auto',
  backgroundColor: '#fff',
  borderRadius: '4px',
}

const searchItemStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px',
  borderBottom: '1px solid #eee',
}

const addButton: React.CSSProperties = {
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
}

const clearButton: React.CSSProperties = {
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  marginLeft: '10px',
}

// ----------------------------------------------------

const CalendarGenerator: React.FC = () => {
  const router = useRouter()
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [currentSchedule, setCurrentSchedule] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [colorIndex, setColorIndex] = useState(0)

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const res = await fetch('/api/calendar')
        if (!res.ok) throw new Error('Failed to fetch schedule data')
        const data: Course[] = await res.json() // 💡 모든 과목에 credits 속성 추가 (데이터에 학점이 없는 경우 임시로 0학점 부여)
        const coursesWithCredits = data.map((c) => {
          const creditsValue = Number(c.credits)
          return {
            ...c,
            credits: Number.isFinite(creditsValue) ? creditsValue : 0,
          }
        })
        setAllCourses(coursesWithCredits)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    const loadSavedSchedule = async () => {
      try {
        const res = await fetch('/api/calendar/save?userId=defaultuser')
        if (res.ok) {
          const data = await res.json()
          if (data.courses && data.courses.length > 0) {
            // Load saved courses with colors
            const coursesWithColors = data.courses.map(
              (course: Course, index: number) => ({
                ...course,
                color: COURSE_COLORS[index % COURSE_COLORS.length],
              })
            )
            setCurrentSchedule(coursesWithColors)
            setColorIndex(data.courses.length % COURSE_COLORS.length)
          }
        }
      } catch (error) {
        console.error('Error loading saved schedule:', error)
      }
    }

    const loadData = async () => {
      await Promise.all([fetchAllCourses(), loadSavedSchedule()])
      setLoading(false)
    }

    loadData()
  }, [])

  const filteredCourses = useMemo(() => {
    if (!searchTerm) return []
    const term = searchTerm.toLowerCase()
    const filtered = allCourses.filter((course) => {
      const matches =
        course.name.toLowerCase().includes(term) ||
        course.professor.toLowerCase().includes(term) ||
        course.courseCode.toLowerCase().includes(term) ||
        (course.day || '').toLowerCase().includes(term) ||
        (course.rawLecture || '').toLowerCase().includes(term)
      return matches
    })
    console.log(
      'Search term:',
      term,
      'Total courses:',
      allCourses.length,
      'Filtered:',
      filtered.length
    )
    return filtered
  }, [allCourses, searchTerm]) // 💡 학점 계산
  const totalCredits = useMemo(() => {
    return currentSchedule.reduce(
      (sum, course) => sum + (course.credits || 0),
      0
    )
  }, [currentSchedule])

  const getSlotsForCourse = (
    course: Course
  ): Array<{ day: string; slot: string }> => {
    const results: Array<{ day: string; slot: string }> = []
    const pad = (n: number) => String(n).padStart(2, '0')

    const pushPeriodAsSlot = (day: string, period: number) => {
      if (!day || period < 1 || period > 13) return
      const startHour = 8 + period
      if (startHour < 9 || startHour > 21) return
      results.push({
        day,
        slot: `${pad(startHour)}:00-${pad(startHour + 1)}:00`,
      })
    }

    const raw = (course.rawLecture || '').replace(/\s+/g, '')
    if (raw) {
      const re = /([월화수목금토일])\(([^)]+)\)/g
      let m: RegExpExecArray | null
      while ((m = re.exec(raw)) !== null) {
        const day = m[1]
        const inside = m[2]
        const parts = inside.split(/[,，\/]/).map((s) => s.trim())
        for (const p of parts) {
          const value = parseValueFromTime(p)
          if (value !== null) {
            let period: number
            if (value >= 1 && value <= 13) {
              period = value
            } else if (value >= 9 && value <= 21) {
              period = value - 8
            } else {
              continue
            }
            pushPeriodAsSlot(day, period)
          }
        }
      }
    }

    if (results.length === 0) {
      const startValue = parseValueFromTime(
        course.timeStart || course.timeEnd || ''
      )
      if (startValue !== null && course.day) {
        let period: number
        if (startValue >= 1 && startValue <= 13) {
          period = startValue
        } else if (startValue >= 9 && startValue <= 21) {
          period = startValue - 8
        } else {
          period = -1
        }

        if (period !== -1) pushPeriodAsSlot(course.day, period)
      }
    }

    const uniq: Array<{ day: string; slot: string }> = []
    const seen = new Set<string>()
    for (const r of results) {
      const k = `${r.day}_${r.slot}`
      if (!seen.has(k)) {
        seen.add(k)
        uniq.push(r)
      }
    }
    return uniq
  }

  const addCourse = (course: Course) => {
    const slots = getSlotsForCourse(course)

    const isFullyUnscheduled =
      slots.length === 0 || !slots.some((s) => TIME_SLOTS.includes(s.slot)) // 💡 추가할 과목에 색상 지정

    const courseWithColor: Course = {
      ...course,
      _id:
        course._id ||
        `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      color: COURSE_COLORS[colorIndex],
    }

    if (isFullyUnscheduled) {
      setCurrentSchedule((prev) => [...prev, courseWithColor])
      setColorIndex((prev) => (prev + 1) % COURSE_COLORS.length) // 색상 인덱스 업데이트
      alert('시간 정보를 파싱하지 못했습니다. 미할당 목록에 추가됩니다.')
      return
    }

    const conflicts: Array<{ day: string; slot: string; existing: Course }> = []
    for (const s of slots) {
      const key = `${s.day}_${s.slot}`
      const existing = scheduleMap.get(key)
      if (existing) conflicts.push({ day: s.day, slot: s.slot, existing })
    }

    if (conflicts.length > 0) {
      const msg = conflicts
        .map((c) => `${c.day} ${c.slot} (기존: ${c.existing.name})`)
        .join('\n')
      alert('겹침: 다음 시간대가 이미 사용 중입니다:\n' + msg)
      return
    }

    setCurrentSchedule((prev) => [...prev, courseWithColor])
    setColorIndex((prev) => (prev + 1) % COURSE_COLORS.length) // 색상 인덱스 업데이트
  }

  const removeCourse = (_id?: string) => {
    if (!_id) return
    setCurrentSchedule((prev) => prev.filter((c) => c._id !== _id)) // 색상 인덱스는 따로 업데이트하지 않아도 됨 (새 과목 추가 시 순환되므로)
  } // 💡 시간표 초기화 함수
  const clearSchedule = () => {
    if (window.confirm('시간표의 모든 과목을 제거하시겠습니까?')) {
      setCurrentSchedule([])
      setColorIndex(0) // 색상 인덱스 초기화
      alert('시간표가 초기화되었습니다.')
    }
  }

  const saveSchedule = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/calendar/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'defaultuser',
          courses: currentSchedule,
        }),
      })
      if (!res.ok) throw new Error('Failed to save schedule')
      alert('시간표가 저장되었습니다!')
    } catch (error) {
      console.error('Error saving schedule:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const scheduleMap = useMemo(() => {
    const map = new Map<string, Course>()
    currentSchedule.forEach((course) => {
      const slots = getSlotsForCourse(course)
      for (const s of slots) {
        const key = `${s.day}_${s.slot}`
        if (!map.has(key)) map.set(key, course)
      }
    })
    return map
  }, [currentSchedule])

  const { rowSpanMap, skipSet } = useMemo(() => {
    const rowSpanMap = new Map<string, number>()
    const skipSet = new Set<string>()
    const idx = (slot: string) => TIME_SLOTS.indexOf(slot)

    for (const course of currentSchedule) {
      const slots = getSlotsForCourse(course)
      const byDay = new Map<string, string[]>()
      for (const s of slots) {
        if (!byDay.has(s.day)) byDay.set(s.day, [])
        byDay.get(s.day)!.push(s.slot)
      }

      for (const [day, slotArr] of byDay) {
        const sorted = slotArr
          .slice()
          .sort((a, b) => idx(a) - idx(b))
          .filter((s) => idx(s) >= 0)

        let i = 0
        while (i < sorted.length) {
          let j = i + 1
          while (j < sorted.length && idx(sorted[j]) === idx(sorted[j - 1]) + 1)
            j++

          const start = sorted[i]
          const len = j - i
          const keyStart = `${day}_${start}`

          rowSpanMap.set(keyStart, len)

          for (let k = i + 1; k < j; k++) {
            skipSet.add(`${day}_${sorted[k]}`)
          }
          i = j
        }
      }
    }

    return { rowSpanMap, skipSet }
  }, [currentSchedule])

  if (loading) {
    return (
      <div style={mainContainerStyle}>
        <div style={{ padding: '20px' }}>
          일정 데이터를 불러오는 중입니다...
        </div>
      </div>
    )
  }

  return (
    <div style={mainContainerStyle}>
      <div style={{ padding: '20px' }}>
        <h2>시간표에 추가할 과목 검색</h2>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="과목명, 교수명 또는 과목코드로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
        <div style={{ marginBottom: '10px', fontSize: '12px', color: '#666' }}>
          총 과목 수: {allCourses.length} | 검색어: "{searchTerm}" | 필터링
          결과: {filteredCourses.length}개
        </div>
        {searchTerm && (
          <div style={searchResultsContainerStyle}>
            {filteredCourses.length > 0 ? (
              filteredCourses.slice(0, 10).map((course, index) => (
                <div key={course._id || index} style={searchItemStyle}>
                  <span>
                    <strong>{course.name}</strong> ({course.courseCode}) -
                    {cleanProfessorName(course.professor)} {course.day} /{' '}
                    {course.credits}학점
                    {course.rawLecture ? ` — ${course.rawLecture}` : ''}
                  </span>
                  <button onClick={() => addCourse(course)} style={addButton}>
                    추가
                  </button>
                </div>
              ))
            ) : (
              <p style={{ padding: '10px', color: '#666' }}>
                검색 결과가 없습니다.
              </p>
            )}
          </div>
        )}
        <h3 style={{ marginTop: '30px' }}>나의 시간표</h3>
        <div
          style={{ marginBottom: '15px', fontWeight: 'bold', fontSize: '18px' }}
        >
          총 학점: {totalCredits}학점
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th
                  style={{
                    ...cellStyle,
                    height: cellHeight,
                    minHeight: cellHeight,
                  }}
                >
                  시간/요일
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day}
                    style={{
                      ...cellStyle,
                      height: cellHeight,
                      minHeight: cellHeight,
                    }}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((timeRange) => (
                <tr key={timeRange} style={{ height: cellHeight }}>
                  <td style={{ ...cellStyle, fontWeight: 'bold' }}>
                    {timeRange}
                  </td>
                  {DAYS.map((day) => {
                    const key = `${day}_${timeRange}`
                    if (skipSet.has(key)) return null

                    const course = scheduleMap.get(key)
                    const rowSpan = rowSpanMap.get(key)

                    const cellDisplay: React.CSSProperties = course
                      ? {
                          backgroundColor: course.color || '#e0f7fa',
                          color: '#000',
                          textAlign: 'center',
                          cursor: 'pointer',
                          height: rowSpan
                            ? `calc(${cellHeight} * ${rowSpan})`
                            : cellHeight,
                          verticalAlign: 'middle',
                        }
                      : {
                          backgroundColor: '#ffffff',
                          height: cellHeight,
                        }

                    return (
                      <td
                        key={day}
                        rowSpan={rowSpan}
                        style={{ ...cellStyle, ...cellDisplay }}
                        onClick={() =>
                          course &&
                          window.confirm(
                            '이 과목을 시간표에서 제거하시겠습니까?'
                          ) &&
                          removeCourse(course._id)
                        }
                      >
                        {course ? (
                          <div style={{ fontSize: '12px', padding: '0 5px' }}>
                            <strong>{course.name}</strong>
                            <br />
                            <span style={{ fontSize: '10px' }}>
                              {course.location} /{' '}
                              {cleanProfessorName(course.professor)}
                            </span>
                            <div
                              style={{
                                color: '#d32f2f',
                                fontSize: '10px',
                                marginTop: '5px',
                              }}
                            >
                              [클릭하여 제거]
                            </div>
                          </div>
                        ) : (
                          ''
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={saveSchedule}
            disabled={saving}
            style={{
              backgroundColor: saving ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '16px',
            }}
          >
            {saving ? '저장 중...' : '시간표 저장'}
          </button>
          <button onClick={clearSchedule} style={clearButton}>
            시간표 초기화
          </button>
        </div>
        {(() => {
          const unscheduled = currentSchedule.filter((c) => {
            const slots = getSlotsForCourse(c)
            if (slots.length === 0) return true
            return !slots.some((s) => scheduleMap.has(`${s.day}_${s.slot}`))
          })
          return (
            unscheduled.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <h4>미할당 과목 (시간 정보 오류 또는 범위 이탈)</h4>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  {unscheduled.map((c, index) => (
                    <div
                      key={c._id || index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1px solid #f0ad4e',
                        padding: '8px',
                        borderRadius: '4px',
                        backgroundColor: '#fcf8e3',
                      }}
                    >
                      <div>
                        <strong>{c.name}</strong> ({c.courseCode}) — {c.day}
                        {c.timeStart || ''} {c.timeEnd ? `-${c.timeEnd}` : ''}
                        {c.rawLecture ? ` (${c.rawLecture})` : ''}
                      </div>
                      <div>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                '이 과목을 시간표에서 제거하시겠습니까?'
                              )
                            )
                              removeCourse(c._id)
                          }}
                          style={{
                            ...addButton,
                            backgroundColor: '#d9534f',
                            marginLeft: '10px',
                          }}
                        >
                          제거
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )
        })()}
      </div>
    </div>
  )
}

export default CalendarGenerator
