import AuthActions from '@/components/auth/AuthActions'
import AuthCard from '@/components/auth/AuthCard'
import { CardContent } from '@/components/ui/card'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Link Account',
  description: 'Link your social account with your existing DevFlow account'
}

function LinkAccount() {
  return (
    <AuthCard title={`Looks Like You Already Have an Account!`}>
      <CardContent className="flex flex-col gap-9 -mt-5 p-0">
        <section className="paragraph-regular text-dark500_light400 flex flex-col gap-4 ">
          <p className="">
            It seems you&apos;ve previously created an account using your email and password.
          </p>
          <p className="">
            Would you like to link this account with your social login to keep everything in one
            place?
          </p>
          <p className="">
            Don&apos;t worry—your existing account will stay the same, and you can seamlessly access
            it using either method.
          </p>
        </section>
        <div className="gap-6.25 flex flex-col">
          <AuthActions
            buttonTitle="Yes, Link My Accounts"
            AuthType="other"
            otherActionTitle="No, I'll Keep Using Email Login"
            otherActionUrl="/"
          />
        </div>
      </CardContent>
    </AuthCard>
  )
}

export default LinkAccount
