import mongoose from 'mongoose'
export async function connectToDatabase() {
  mongoose.set('strictQuery', true)

  if (!process.env.MONGODB_URL) {
    return console.log('MongoDB_URL is not defined')
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: 'devflow'
    })
  } catch (error) {
    console.log('Error connecting to MongoDB:', error)
  }
}
