import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="relative bg-[#233123] text-white h-[99vh] flex items-center justify-center -mt-20">
        <div className="text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            School Supporter
          </h1>
          <p className="text-lg md:text-xl mb-8">
            학교 생활을 더 쉽고, 더 즐겁게! 학생을 위한 지원 플랫폼
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="#features"
              className="bg-white text-[#233123] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              기능 확인하기
            </a>
            <a
              href="#features2"
              className="bg-white text-[#233123] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              설명 확인하기
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 bg-gray-50 h-[99vh] flex items-center justify-center"
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">주요 기능</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-4">시간표</h3>
              <p>개인별 맞춤 시간표, 강의실 위치 정보 등을 확인할 수 있어요.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-4"> 일정</h3>
              <p>
                학교 공지와 학사 일정, 시험 날짜,과제까지 한눈에 확인할 수
                있어요.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-4">게시판</h3>
              <p>
                익명 게시판으로 서로 편하게 소통하며 커뮤니티를 즐길 수 있어요.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-4">도서</h3>
              <p>
                도서 검색 기능과 대출, 반납, 예약 등을 편하게 확인할 수 있어요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="features2"
        className="py-20 bg-[#233123] text-white h-[99vh] flex items-center justify-center"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">School Supporter란?</h2>
          <p className="text-lg leading-relaxed">
            School Supporter는 학생들이 학교 생활을 효율적으로 관리하고,
            소통하며, 즐길 수 있도록 만든 통합 플랫폼입니다. 과제, 일정,
            커뮤니티 등 모든 기능을 한 곳에서 경험하세요.
          </p>
        </div>
      </section>
    </main>
  )
}
