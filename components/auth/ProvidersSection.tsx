'use client'
import { useSocialAuth } from '@/lib/auth/auth-client'
import { MotionButton } from '../ui/button'
import Image from 'next/image'
function ProvidersSection() {
  const { signInSocial } = useSocialAuth()
  return (
    <section className="flex justify-between gap-2.5 ">
      <MotionButton
        className=" flex-1/3 h-12 lg:flex-1/2   background-light900_dark400 text-dark200_light800 group cursor-pointer"
        onClick={() => signInSocial('github')}
      >
        <Image
          src="/assets/icons/GitHub_White.svg"
          width={30}
          height={30}
          alt="github"
          className="invert-100 max-lg:w-10 dark:invert-0 max-lg:h-10 group-hover:invert-0 dark:group-hover:invert-100"
        />
        <p className="hidden lg:block group-hover:invert-100">Login with GitHub</p>
      </MotionButton>
      <MotionButton
        className="flex-1/3 h-12 lg:flex-1/2  background-light900_dark400 text-dark200_light800 group cursor-pointer"
        onClick={() => signInSocial('google')}
        type="button"
      >
        <Image
          src="/assets/icons/google.svg"
          width={20}
          height={20}
          alt="google"
          className="max-lg:w-7.5 max-lg:h-7.5"
        />
        <p className="hidden lg:block group-hover:invert-100">Login with Google</p>
      </MotionButton>
    </section>
  )
}

export default ProvidersSection
