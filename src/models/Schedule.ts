import mongoose from 'mongoose'

const ScheduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['assignment', 'exam'], required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
)

export default mongoose.models.Schedule ||
  mongoose.model('Schedule', ScheduleSchema)
