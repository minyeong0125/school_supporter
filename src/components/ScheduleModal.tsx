'use client'

import { useState, useEffect } from 'react'

export default function ScheduleModal({
  open,
  onClose,
  onSave,
  schedule,
  onRefresh,
}: any) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState('assignment')

  useEffect(() => {
    if (schedule) {
      setTitle(schedule.title)
      setType(schedule.type)
    } else {
      setTitle('')
      setType('assignment')
    }
  }, [schedule])

  if (!open) return null

  const handleDelete = async () => {
    if (!schedule) return

    const ok = confirm(`[${schedule.title}] 일정을 삭제할까요?`)
    if (!ok) return

    // DELETE 요청 (Next.js 14 App Router 호환)
    await fetch('/api/schedules', {
      method: 'DELETE',
      body: JSON.stringify({ id: schedule.id }),
    })

    onClose()
    onRefresh()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-5 rounded shadow w-80">
        <h2 className="text-lg font-bold mb-3">
          {schedule ? '일정 수정' : '일정 추가'}
        </h2>

        <label className="block">제목</label>
        <input
          className="border w-full px-2 py-1 mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="block">종류</label>
        <select
          className="border w-full px-2 py-1 mb-3"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="assignment">과제</option>
          <option value="exam">시험</option>
          <option value="project">프로젝트</option>
          <option value="personal">개인 일정</option>
        </select>

        <div className="flex justify-between gap-2">
          {schedule && (
            <button
              className="px-3 py-1 bg-red-600 text-white"
              onClick={handleDelete}
            >
              삭제
            </button>
          )}

          <div className="flex gap-2 ml-auto">
            <button className="px-3 py-1 bg-gray-300" onClick={onClose}>
              취소
            </button>
            <button
              className="px-3 py-1 bg-blue-600 text-white"
              onClick={() => onSave({ title, type })}
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
