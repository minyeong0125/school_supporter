import { NextResponse } from 'next/server'

import Comment from '@/models/comment'
import { connectDB } from '@/lib/mongodb'

// POST /comments  → 댓글 생성
export async function POST(req: Request) {
  try {
    await connectDB()
    const { postId, comment, authorId, displayName } = await req.json()

    if (!postId || !comment) {
      return NextResponse.json(
        { message: 'postId와 comment는 필수입니다.' },
        { status: 400 }
      )
    }

    const newComment = await Comment.create({
      postId,
      comment,
      authorId,
      displayName,
    })

    return NextResponse.json({
      message: '댓글 작성 완료',
      comment: newComment,
    })
  } catch (error) {
    return NextResponse.json({ message: '서버 오류', error }, { status: 500 })
  }
}

// GET /comments?postId=123  → 특정 게시글 댓글 불러오기
export async function GET(req: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const postId = searchParams.get('postId')

    const filter = postId ? { postId } : {}
    const comments = await Comment.find(filter).sort({ createdAt: -1 })

    return NextResponse.json(comments)
  } catch (error) {
    return NextResponse.json({ message: '서버 오류', error }, { status: 500 })
  }
}
