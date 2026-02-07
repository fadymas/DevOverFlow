import { Document, model, models, Schema } from 'mongoose'

export interface IAnswer extends Document {
  author: Schema.Types.ObjectId
  question: Schema.Types.ObjectId
  content: string
  upvotes: Schema.Types.ObjectId[]
  downvotes: Schema.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const AnswerSchema = new Schema<IAnswer>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'UserProfile',
      required: true
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    upvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'UserProfile'
      }
    ],
    downvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'UserProfile'
      }
    ]
  },
  {
    timestamps: true // creates createdAt & updatedAt automatically
  }
)

export const Answer = models.Answer || model('Answer', AnswerSchema, 'answer')
