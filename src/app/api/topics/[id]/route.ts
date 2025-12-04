import { connectDB } from '@/lib/mongodb'
import Topic from '@/models/topic'
import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'

// -------------------- GET: 글 조회 --------------------
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ⬅ GET도 Promise형으로 통일
) {
  try {
    const { id } = await context.params // ⬅ await로 풀기
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 })
    }

    const topic = await Topic.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )

    if (!topic)
      return NextResponse.json({ message: 'Topic not found' }, { status: 404 })

    return NextResponse.json({ topic }, { status: 200 })
  } catch (err) {
    console.error('GET /api/topics/[id] ERROR:', err)
    return NextResponse.json({ message: 'Server Error' }, { status: 500 })
  }
}

// -------------------- PUT: 글 수정 --------------------
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // ⬅ 동일하게 유지
) {
  try {
    const { id } = await context.params

    const { newTitle: title, newDescription: description } =
      await request.json()

    if (!title || !description) {
      return NextResponse.json(
        { message: 'Title and description are required' },
        { status: 400 }
      )
    }

    await connectDB()

    const updatedTopic = await Topic.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    )

    if (!updatedTopic) {
      return NextResponse.json({ message: 'Topic not found' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'Topic updated', topic: updatedTopic },
      { status: 200 }
    )
  } catch (error) {
    console.error('PUT /api/topics/[id] ERROR:', error)
    return NextResponse.json({ message: 'Server Error' }, { status: 500 })
  }
}
