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
import { URLProps } from '@/types'
import CustomUserAvatar from '@/components/shared/CustomUserAvatar'
import { Metadata } from 'next'

export async function generateMetadata({ params }: URLProps): Promise<Metadata> {
  const { id } = await params
  const { user } = await getUserInfo({ userId: id })
  return {
    title: `${user.userId.name}'s Profile`
  }
}

async function Page({ params, searchParams }: URLProps) {
  const { id } = await params

  const { user, totalQuestions, totalAnswers, badgeCounts, reputation } = await getUserInfo({
    userId: id
  })

  const session = await auth.api.getSession({
    headers: await headers()
  })

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          {user.userId.image ? (
            <Image
              src={user.userId.image}
              alt="profile image"
              width={140}
              height={140}
              className="rounded-full object-cover"
            />
          ) : (
            <CustomUserAvatar name={user.userId.name} />
          )}
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
            <Link
              href="/profile/edit"
              className="paragraph-medium  min-h-11.5 min-w-43.75 px-4 py-3 transition-all  bg-linear-to-r from-primary-from to-primary-to text-white  rounded-md  text-center link "
            >
              Edit Profile
            </Link>
          )}
        </div>
      </div>
      <Stats
        totalQuestions={totalQuestions}
        totalAnswers={totalAnswers}
        badges={badgeCounts}
        reputation={reputation}
      />
      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-10.5 p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            <QuestionTab userId={user._id.toString()} />
          </TabsContent>
          <TabsContent value="answers" className="flex w-full flex-col gap-6">
            <AnswersTab userId={user._id.toString()} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default Page
