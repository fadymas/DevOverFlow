import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URL!, { timeoutMS: 1000000 })
await client.connect()

export const adapter = mongodbAdapter(client.db('devflow'))
