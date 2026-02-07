import { Schema, models, model, Document } from 'mongoose'

export interface IQuestion extends Document {
  title: string
  content: string
  tags: Schema.Types.ObjectId[] // to connect with another model
  views: number
  upvotes: Schema.Types.ObjectId[] // to connect to spesific people
  downvotes: Schema.Types.ObjectId[]
  author: Schema.Types.ObjectId
  answers: Schema.Types.ObjectId[]
  createdAt: Date
}

const QuestionSchema = new Schema<IQuestion>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }], // reference to Tag model
  views: { type: Number, default: 0 },
  upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }], // reference to User model
  downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
  createdAt: { type: Date, default: Date.now }
})

const Question = models.Question || model<IQuestion>('Question', QuestionSchema, 'question')

export default Question
