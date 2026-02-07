import { Schema, model, models, Document } from 'mongoose'

export interface IInteraction extends Document {
  user: Schema.Types.ObjectId
  action: string
  question: Schema.Types.ObjectId
  answer: Schema.Types.ObjectId
  tags: Schema.Types.ObjectId[]
  createdAt: Date
}

const InteractionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'UserProfile', required: true },
  action: { type: String, required: true },
  question: { type: Schema.Types.ObjectId, ref: 'Question' },
  answer: { type: Schema.Types.ObjectId, ref: 'Answer' },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }]
})

const Interaction = models.Interaction || model('Interaction', InteractionSchema, 'interaction')

export default Interaction
