'use client'

import Link from 'next/link'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'

export default function Navbar() {
  const { status, data: session } = useSession()

  return (
    <nav className="fixed top-0 left-0 w-full z-10 bg-[#233123] backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        {/* 로고 */}
        <Link href="/" className="text-xl font-bold text-gray-200">
          School Supporter
        </Link>

        {/* 오른쪽 UI */}
        <div className="flex items-center gap-6 text-gray-200 font-medium">
          {status === 'authenticated' ? (
            <>
              {/* 🔹 로그인 상태일 때만 메뉴 표시 */}
              <Link href="/calendar" className="hover:text-gray-300">
                시간표
              </Link>
              <Link href="/scheduler" className="hover:text-gray-300">
                일정
              </Link>
              <Link href="/board" className="hover:text-gray-300">
                게시판
              </Link>
              <Link href="/library/books" className="hover:text-gray-300">
                도서
              </Link>

              {/* 프로필 */}
              <div className="flex items-center gap-2">
                <Image
                  src={session?.user?.image ?? '/default-avatar.png'}
                  alt="profile"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
                <span className="font-semibold">{session?.user?.name}</span>
              </div>

              {/* 로그아웃 */}
              <button
                onClick={() => signOut()}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              {/* 🔹 로그아웃 상태에서는 메뉴 숨김 (Login/Signup만 표시) */}
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md font-semibold"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
