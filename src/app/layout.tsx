'use client'

import Navbar from '@/components/navbar'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { LibraryProvider } from './library/context/LibraryContext'
import { Toaster } from 'react-hot-toast'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="font-sans bg-white text-gray-700">
        <SessionProvider>
          <LibraryProvider>
            <Navbar />
            {/* 토스트 메시지 표시 */}
            <Toaster position="top-right" />
            <main className="pt-20">{children}</main>
          </LibraryProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
