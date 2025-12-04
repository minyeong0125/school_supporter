'use client';

import Link from 'next/link';
import { useLibrary } from '../context/LibraryContext';
import toast from 'react-hot-toast';

export default function MyLibrary() {
  const { borrowList, reserveList, returnBook, cancelReserve } = useLibrary();

  // 대출 리스트: 반납 예정일 계산
  const borrowListWithDates = borrowList.map((book) => {
    const borrowDays = 7;
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + borrowDays);
    const diffTime = dueDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      ...book,
      dueDate: dueDate.toISOString().split('T')[0],
      daysLeft,
    };
  });

  // 예약 리스트: 예약일 + 대기 순번
  const reserveListWithDates = reserveList.map((book, index) => {
    const today = new Date();
    return {
      ...book,
      reservDate: today.toISOString().split('T')[0],
      waitingPosition: index + 1,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-50">
      {/* 헤더 */}
      <header className="bg-[#233123] py-8 px-4 shadow-sm -mt-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">내 서재</h1>
            <p className="text-gray-50 text-sm mt-1">
              현재 대출 현황과 예약 목록을 확인하세요.
            </p>
          </div>
          <Link
            href="/library/books"
            className="bg-white text-[#233123] px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
          >
            📚 도서 검색
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 space-y-12">
        {/* 대출중인 책 */}
        <section>
          <h2 className="text-2xl text-[#233123] font-bold mb-6 flex items-center">
            📖 대출중인 책
            <span className="ml-3 text-sm bg-gray-200 text-gray-700 py-1 px-3 rounded-full font-medium">
              {borrowListWithDates.length}권
            </span>
          </h2>

          {borrowListWithDates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {borrowListWithDates.map((book) => (
                <div
                  key={book.isbn}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 transition hover:shadow-md"
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-16 h-24 object-contain rounded-md bg-gray-200"
                  />
                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div>
                      <h3 className="text-lg text-[#233123] font-bold line-clamp-1 mb-1">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        {book.author}
                      </p>

                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${
                          book.daysLeft < 0
                            ? 'bg-red-100 text-red-600'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {book.daysLeft < 0
                          ? `연체 (${Math.abs(book.daysLeft)}일)`
                          : `반납 ${book.daysLeft}일 전`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <div className="text-sm text-gray-600 font-medium">
                        반납 예정일: {book.dueDate}
                      </div>
                      <button
                        onClick={() => {
                          returnBook(book.isbn);
                          toast.success(`${book.title} ✅ 반납 완료!`);
                        }}
                        className="text-sm mt-3 text-red-600 hover:underline"
                      >
                        반납하기
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-xl border">
              <p className="text-gray-500">대출 중인 도서가 없습니다.</p>
            </div>
          )}
        </section>

        <hr className="border-gray-200" />

        {/* 예약한 책 */}
        <section>
          <h2 className="text-2xl text-[#233123] font-bold mb-6 flex items-center">
            ⏳ 예약한 책
            <span className="ml-3 text-sm bg-gray-200 text-gray-700 py-1 px-3 rounded-full font-medium">
              {reserveListWithDates.length}권
            </span>
          </h2>

          {reserveListWithDates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reserveListWithDates.map((book) => (
                <div
                  key={book.isbn}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 transition hover:shadow-md"
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-16 h-24 object-contain rounded-md bg-gray-200"
                  />

                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div>
                      <h3 className="text-lg text-[#233123] font-bold line-clamp-1 mb-1">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        {book.author}
                      </p>

                      <span className="text-xs font-bold px-2 py-1 rounded bg-amber-100 text-amber-800">
                        예약중
                      </span>
                    </div>

                    <div className="flex justify-between items-end mt-3">
                      <div className="text-sm text-gray-600">
                        예약일: {book.reservDate}
                      </div>
                      <div className="text-right">
                        <button
                          onClick={() => {
                            cancelReserve(book.isbn);
                            toast.success(`${book.title} ❌ 예약 취소됨`);
                          }}
                          className="text-sm text-red-600 hover:underline mt-2"
                        >
                          예약 취소
                        </button>
                        <span className="block text-xs text-gray-500">
                          대기 순번
                        </span>
                        <span className="text-xl font-bold text-amber-500">
                          {book.waitingPosition}위
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-xl border-gray-300">
              <p className="text-gray-500">예약한 도서가 없습니다.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
