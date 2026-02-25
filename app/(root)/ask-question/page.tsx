import Question from '@/components/forms/Question'
import { getUserById } from '@/lib/actions/user.action'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ask a Question',
  description: 'Ask a question on DevFlow to get help from the community.'
}

async function AskQuestion() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session?.user) redirect('/sign-in')

  const mongoUser = await getUserById({ userId: session.user.id })

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900"> Ask a Question</h1>
      <div className="mt-9">
        <Question mongoUserId={JSON.stringify(mongoUser._id)} type="create" />
      </div>
    </div>
  )
}

export default AskQuestion
