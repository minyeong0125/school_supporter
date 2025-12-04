// app/calendar/page.tsx

import Navbar from '../../components/navbar'
import CalendarGenerator from '../../components/CalendarGenerator' // CalendarGenerator 컴포넌트 임포트

// 💡 [수정] mainContentStyle 정의:
const mainContentStyle: React.CSSProperties = {
  // 1. 최대 너비 제한 (CalendarGenerator의 mainContainerStyle과 일치시킵니다)
  maxWidth: '1200px',
  // 2. 좌우 여백을 자동으로 설정하여 중앙 정렬
  margin: '0 auto',
  // 3. 좌우 패딩 유지 (선택 사항이지만 콘텐츠가 가장자리에 붙지 않게 합니다)
  padding: '0 20px',
}

const CalendarPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <Navbar />

      <main style={mainContentStyle}>
        {' '}
        {/* 💡 [핵심 수정] mainContentStyle 적용 */}
        <div style={{ padding: '20px' }}>
          <h2>🏫 중부대 시간표</h2>
          <p>과목명, 교수명 등을 검색하여 나만의 시간표를 만들어보세요.</p>
        </div>
        {/* CalendarGenerator 내부에서도 이미 가운데 정렬이 되어 있습니다. */}
        <CalendarGenerator />
      </main>
    </div>
  )
}

export default CalendarPage
