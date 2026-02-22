import mongoose from 'mongoose'
export async function connectToDatabase() {
  mongoose.set('strictQuery', true)
  let isConnected = false
  if (!process.env.MONGODB_URL) {
    return console.log('MongoDB_URL is not defined')
  }

  if (isConnected) {
    console.log('Already connected to MongoDB')
    return
  }
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: 'devflow'
    })
    isConnected = true
  } catch (error) {
    console.log('Error connecting to MongoDB:', error)
  }
}
