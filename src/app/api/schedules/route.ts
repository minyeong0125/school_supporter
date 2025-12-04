import { connectToDB } from '@/utils/database'
import { ObjectId } from 'mongodb'

// GET ---------------------------
export async function GET() {
  try {
    const db = await connectToDB()
    const schedules = await db.collection('schedules').find().toArray()

    return new Response(JSON.stringify(schedules), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}

// POST --------------------------
export async function POST(req: Request) {
  try {
    const db = await connectToDB()
    const body = await req.json()

    await db.collection('schedules').insertOne(body)

    return new Response(JSON.stringify({ message: 'Added' }), { status: 201 })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}

// PUT ---------------------------
export async function PUT(req: Request) {
  try {
    const db = await connectToDB()
    const { id, title, type, date } = await req.json()

    await db
      .collection('schedules')
      .updateOne({ _id: new ObjectId(id) }, { $set: { title, type, date } })

    return new Response(JSON.stringify({ message: 'Updated' }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}

// DELETE ------------------------
export async function DELETE(req: Request) {
  try {
    const db = await connectToDB()
    const { id } = await req.json()

    await db.collection('schedules').deleteOne({ _id: new ObjectId(id) })

    return new Response(JSON.stringify({ message: 'Deleted' }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}
