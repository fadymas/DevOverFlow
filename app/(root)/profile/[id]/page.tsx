import { Button } from '@/components/ui/button'
import { getUserInfo } from '@/lib/actions/user.action'
import Image from 'next/image'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getJoinedMonthYear } from '@/lib/utils'
import ProfileLink from '@/components/shared/ProfileLink'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import Stats from '@/components/shared/Stats'
import QuestionTab from '@/components/shared/QuestionTab'
import AnswersTab from '@/components/shared/AnswersTab'
async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user, totalQuestions, totalAnswers } = await getUserInfo({ userId: id })

  const session = await auth.api.getSession({
    headers: await headers()
  })

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={user.userId.image}
            alt="profile image"
            width={140}
            height={140}
            className="rounded-full object-cover"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{user.userId.name}</h2>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {user.portfolioWebsite && (
                <ProfileLink
                  imgUrl="/assets/icons/link.svg"
                  href={user.portfolioWebsite}
                  title="Portfolio"
                />
              )}
              {user.location && (
                <ProfileLink imgUrl="/assets/icons/location.svg" title={user.location} />
              )}

              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={getJoinedMonthYear(user.joinedAt)}
              />
            </div>

            {user.bio && <p className="paragraph-regular text-dark400_light800 mt-8">{user.bio}</p>}
          </div>
        </div>
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          {/* {
            if authinticated and userId = authinticated user
          } */}
          {session?.user.id === user.userId._id.toString() && (
            <Link href="/profile/edit">
              <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-11.5 min-w-43.75 px-4 py-3">
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      </div>
      <Stats totalQuestions={totalQuestions} totalAnswers={totalAnswers} />
      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-10.5 p-1">
            <TabsTrigger value="top-posts" className="tab">
              QuestionTab
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              AnswersTab
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            <QuestionTab userId={user._id.toString()} />
          </TabsContent>
          <TabsContent value="answers">
            <AnswersTab userId={user._id.toString()} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default Page
