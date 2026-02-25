import Profile from '@/components/forms/Profile'
import { getSession } from '@/lib/actions/auth-action'
import { getUserById } from '@/lib/actions/user.action'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Profile',
  description: 'Edit your DevFlow profile'
}

async function page() {
  const { session } = await getSession()

  if (!session) return null
  const mongoUserId = await getUserById({ userId: session.user.id })

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div>
        <Profile user={JSON.stringify(mongoUserId)} />
      </div>
    </>
  )
}

export default page
