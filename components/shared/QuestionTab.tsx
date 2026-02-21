import { getUsersQuestions } from '@/lib/actions/user.action'
import QuestionCard from '../cards/QuestionCard'

interface Props {
  userId: string
}
async function QuestionTab({ userId }: Props) {
  const result = await getUsersQuestions({
    userId,
    page: 1
  })
  return (
    <>
      {result.questions.map((question) => (
        <QuestionCard
          key={question._id}
          _id={question._id}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes}
          views={question.views}
          answers={question.answers}
          createdAt={question.createdAt}
          isProfile={true}
        />
      ))}
    </>
  )
}

export default QuestionTab
