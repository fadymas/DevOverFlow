import { Schema, model, models, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  emailVerified: boolean
  name: string
  image?: string
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    name: { type: String, required: true },
    image: { type: String, required: false }
  },
  { timestamps: true }
)

const User = models.User || model<IUser>('User', userSchema, 'user')

export default User
