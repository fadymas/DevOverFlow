'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useCallback } from 'react'
import { Button } from '../ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/lib/auth/auth-client'

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
  statue = false
}: Props) {
  const { forgetPassword } = useAuth()
  const [seconds, setSeconds] = useState(60)
  const [isActive, setIsActive] = useState(!!email)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1)
      }, 1000)
    } else if (seconds === 0) {
      setIsActive(false)
    }

    return () => clearInterval(interval)
  }, [isActive, seconds])

  const handleResend = useCallback(async () => {
    if (!email) return
    setIsSubmitting(true)
    try {
      await forgetPassword({ email })
      setSeconds(60)
      setIsActive(true)
    } finally {
      setIsSubmitting(false)
    }
  }, [email, forgetPassword])

  const isButtonDisabled = statue || isSubmitting || (!!email && isActive)

  const renderButtonContent = () => {
    if (statue || isSubmitting) return <Spinner />
    if (email && isActive) return `Retry in ${seconds}s`
    return buttonTitle
  }

  return (
    <>
      <Button
        className="py-3 px-4 h-11.25 bg-linear-129 from-primary-from to-primary-to text-light text-light-900 hover:bg-linear-0 cursor-pointer transition-colors"
        disabled={isButtonDisabled}
        onClick={email ? handleResend : undefined}
      >
        {renderButtonContent()}
      </Button>

      {AuthType === 'signIn' && (
        <p className="text-center paragraph-regular text-dark400_light700">
          Don&apos;t have an account?{' '}
          <Link
            href="/sign-up"
            className="paragraph-semibold bg-linear-129 from-primary-from to-primary-to text-light bg-clip-text text-transparent hover:bg-linear-0"
          >
            Sign up
          </Link>
        </p>
      )}

      {AuthType === 'signUp' && (
        <p className="text-center paragraph-regular text-dark400_light700">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="paragraph-semibold bg-linear-129 from-primary-from to-primary-to text-light bg-clip-text text-transparent hover:bg-linear-0"
          >
            Sign in
          </Link>
        </p>
      )}

      {AuthType === 'other' && otherActionUrl && (
        <Link
          href={otherActionUrl}
          className="body-regular text-center text-dark400_light700 flex items-center justify-center"
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
