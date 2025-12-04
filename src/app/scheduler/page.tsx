'use client'

import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ScheduleModal from '@/components/ScheduleModal'

// -----------------------------
// 타입 정의
// -----------------------------
type ScheduleData = {
  id: string
  title: string
  type: string
  date: string
}

// -----------------------------
// 메인 컴포넌트
// -----------------------------
export default function SchedulerPage() {
  const [events, setEvents] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedEvent, setSelectedEvent] = useState<ScheduleData | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // ----------------------------- 색상 자동
  function getColorByType(type: string) {
    const colors: any = {
      assignment: '#4CAF50',
      exam: '#E53935',
      project: '#3F51B5',
      personal: '#FF9800',
    }
    return colors[type] || '#757575'
  }

  // ----------------------------- 일정 불러오기
  const fetchSchedules = async () => {
    const res = await fetch('/api/schedules')
    const data = await res.json()

    const formatted = data.map((item: any) => ({
      id: String(item._id),
      title: item.title,
      date: String(item.date),
      color: getColorByType(item.type),
      extendedProps: { type: item.type },
    }))

    setEvents(formatted)
  }

  // ----------------------------- 날짜 클릭 → 추가
  const handleDateClick = (info: any) => {
    setSelectedEvent(null)
    setSelectedDate(info.dateStr)
    setModalOpen(true)
  }

  // ----------------------------- 일정 클릭 → 모달 열기
  const handleEventClick = (info: any) => {
    setSelectedEvent({
      id: String(info.event.id),
      title: info.event.title,
      type: info.event.extendedProps.type,
      date:
        info.event.startStr ?? info.event.start?.toISOString().split('T')[0],
    })
    setModalOpen(true)
  }

  // ----------------------------- 저장 (추가/수정)
  const saveSchedule = async ({
    title,
    type,
  }: {
    title: string
    type: string
  }) => {
    if (!title) return alert('제목을 입력하세요!')

    if (selectedEvent) {
      // 수정
      await fetch('/api/schedules', {
        method: 'PUT',
        body: JSON.stringify({
          id: selectedEvent.id,
          title,
          type,
          date: selectedEvent.date,
        }),
      })
    } else {
      // 추가
      await fetch('/api/schedules', {
        method: 'POST',
        body: JSON.stringify({
          title,
          type,
          date: selectedDate,
        }),
      })
    }

    setModalOpen(false)
    fetchSchedules()
  }

  useEffect(() => {
    fetchSchedules()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📅 스케줄러</h1>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth',
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="80vh"
      />

      <ScheduleModal
        open={modalOpen}
        schedule={selectedEvent}
        onClose={() => setModalOpen(false)}
        onSave={saveSchedule}
        onRefresh={fetchSchedules}
      />
    </div>
  )
}
