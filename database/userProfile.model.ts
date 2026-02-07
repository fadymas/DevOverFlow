import { Schema, model, models, Document } from 'mongoose'

export interface IUserProfile extends Document {
  userId: Schema.Types.ObjectId
  bio?: string
  location?: string
  portfolioWebsite?: string
  reputation: number
  saved: Schema.Types.ObjectId[]
  joinedAt: Date
}

const userProfileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    bio: String,
    location: String,
    portfolioWebsite: String,
    reputation: {
      type: Number,
      default: 0
    },
    saved: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Question'
      }
    ],
    joinedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
)

const UserProfile =
  models.UserProfile || model<IUserProfile>('UserProfile', userProfileSchema, 'userProfile')

export default UserProfile
