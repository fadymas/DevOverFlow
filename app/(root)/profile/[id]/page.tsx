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
import { MotionButton } from '@/components/ui/button'
import * as motion from 'motion/react-client'
import AnimatedImage from '@/components/Animated/AnimatedImage'
import { scaleIn } from '@/components/Animated/variants'
import { getData } from '@/lib/queries/getData'
export async function generateMetadata({ params }: URLProps): Promise<Metadata> {
  const { id } = await params
  const { user } = await getData(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${id}`)
  return {
    title: `${user.userId.name}'s Profile`
  }
}

async function Page({ params }: URLProps) {
  const { id } = await params

  const { user, totalQuestions, totalAnswers, badgeCounts, reputation } = await getData(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${id}`
  )

  const session = await auth.api.getSession({
    headers: await headers()
  })

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          {user.userId.image ? (
            <AnimatedImage
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              transition={{ type: 'spring', stiffness: 50 }}
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
            <motion.h2
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 50 }}
              className="h2-bold text-dark100_light900"
            >
              {user.userId.name}
            </motion.h2>

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
                title={getJoinedMonthYear(new Date(user.joinedAt))}
              />
            </div>

            {user.bio && (
              <motion.p
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, type: 'spring', stiffness: 50 }}
                className="paragraph-regular text-dark400_light800 mt-8 text-ellipsis line-clamp-2"
              >
                {user.bio}
              </motion.p>
            )}
          </div>
        </div>
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          {/* {
            if authinticated and userId = authinticated user
          } */}
          {session?.user.id === user.userId._id.toString() && (
            <Link href="/profile/edit">
              <MotionButton
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                className="paragraph-medium  min-h-11.5 min-w-43.75 px-4 py-3 transition-all  bg-linear-to-r from-primary-from to-primary-to text-white  rounded-md  text-center cursor-pointer"
              >
                Edit Profile
              </MotionButton>
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
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        className="mt-10 flex gap-10"
      >
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
      </motion.div>
    </>
  )
}

export default Page
