import { NextResponse } from 'next/server'

import Comment from '@/models/comment'
import { connectDB } from '@/lib/mongodb'

// GET /comments/:id → 댓글 1개 조회
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const comment = await Comment.findById(params.id)

    if (!comment)
      return NextResponse.json(
        { message: '댓글을 찾을 수 없습니다.' },
        { status: 404 }
      )

    return NextResponse.json(comment)
  } catch (error) {
    return NextResponse.json({ message: '서버 오류', error }, { status: 500 })
  }
}

// PATCH /comments/:id → 댓글 수정
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const { comment } = await req.json()

    const updated = await Comment.findByIdAndUpdate(
      params.id,
      { comment },
      { new: true }
    )

    if (!updated)
      return NextResponse.json({ message: '댓글 없음' }, { status: 404 })

    return NextResponse.json({ message: '댓글 수정 완료', comment: updated })
  } catch (error) {
    return NextResponse.json({ message: '서버 오류', error }, { status: 500 })
  }
}

// DELETE /comments/:id → 댓글 삭제
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const deleted = await Comment.findByIdAndDelete(params.id)

    if (!deleted)
      return NextResponse.json({ message: '댓글 없음' }, { status: 404 })

    return NextResponse.json({ message: '댓글 삭제 완료' })
  } catch (error) {
    return NextResponse.json({ message: '서버 오류', error }, { status: 500 })
  }
}
