import mongoose, { Schema, model, models } from 'mongoose'

const BorrowSchema = new Schema({
  title: { type: String, required: true },
  author: String,
  isbn: { type: String, required: true },
  cover: String,
  link: String,
  userEmail: { type: String, required: true },
  borrowedAt: { type: Date, default: Date.now },
})

const Borrow = models.Borrow || model('Borrow', BorrowSchema)
export default Borrow
