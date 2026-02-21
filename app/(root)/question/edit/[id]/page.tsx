import Question from '@/components/forms/Question'
import { getSession } from '@/lib/actions/auth-action'
import { getQuestionById } from '@/lib/actions/question.action'
import { getUserById } from '@/lib/actions/user.action'
import { ParamsProps } from '@/types'

async function page({ params }: ParamsProps) {
  const { session } = await getSession()
  const { id } = await params

  if (!session) return null
  const mongoUserId = await getUserById({ userId: session.user.id })
  const result = await getQuestionById({ questionId: id })

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div>
        <Question
          type="Edit"
          mongoUserId={mongoUserId._id.toString()}
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  )
}

export default page
