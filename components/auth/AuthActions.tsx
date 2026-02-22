'use client'
import Link from 'next/link'
import { Button } from '../ui/button'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/lib/auth/auth-client'
import { useState } from 'react'

interface Props {
  buttonTitle: string
  AuthType: 'signIn' | 'signUp' | 'other'
  otherActionTitle?: string
  otherActionUrl?: string
  email?: string
  statue?: boolean
}
function AuthActions({
  buttonTitle,
  AuthType,
  otherActionTitle,
  otherActionUrl,
  email,
  statue
}: Props) {
  const { forgetPassword } = useAuth()
  const [isResend, setIsResend] = useState(false)
  return (
    <>
      <Button
        className="py-3 px-4 h-11.25 bg-linear-129 from-primary-from  to-primary-to text-light text-light-900 hover:bg-linear-0 cursor-pointer transition-colors "
        disabled={statue || isResend}
        onClick={
          email
            ? async () => {
                setIsResend(true)
                const response = await forgetPassword({ email })
                if (response) setIsResend(false)
              }
            : () => {}
        }
      >
        {(statue as boolean) || isResend ? <Spinner /> : buttonTitle}
      </Button>

      {AuthType === 'signIn' ? (
        <p className="text-center paragraph-regular text-dark400_light700 ">
          Don&apos;t have an account?{' '}
          <Link
            href="/sign-up"
            className="paragraph-semibold  bg-linear-129 from-primary-from  to-primary-to text-light bg-clip-text text-transparent hover:bg-linear-0"
          >
            Sign up
          </Link>
        </p>
      ) : AuthType === 'signUp' ? (
        <p className="text-center paragraph-regular text-dark400_light700 ">
          Don&apos;t have an account?{' '}
          <Link
            href="/sign-in"
            className="paragraph-semibold  bg-linear-129 from-primary-from  to-primary-to text-light bg-clip-text text-transparent hover:bg-linear-0"
          >
            Sign in
          </Link>
        </p>
      ) : (
        <Link
          href={`${otherActionUrl}`}
          className="body-regular  text-center  text-dark400_light700  flex items-center justify-center"
        >
          <Image
            src="/assets/icons/arrow-up-right.svg"
            width={20}
            height={20}
            alt=""
            className="-rotate-90 invert-colors"
          />
          {otherActionTitle}
        </Link>
      )}
    </>
  )
}

export default AuthActions
