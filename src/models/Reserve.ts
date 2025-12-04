// src/models/Reserve.ts
import mongoose, { Schema, model, models } from 'mongoose'

const ReserveSchema = new Schema({
  title: { type: String, required: true },
  author: String,
  isbn: { type: String, required: true },
  cover: String,
  link: String,
  userEmail: { type: String, required: true },
  reservedAt: { type: Date, default: Date.now },
})

const Reserve = models.Reserve || model('Reserve', ReserveSchema)
export default Reserve
