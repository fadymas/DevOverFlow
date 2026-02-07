import React from 'react'
import { CardHeader, CardDescription, CardAction, CardTitle } from '../ui/card'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  children: React.ReactNode
  title: string
  description?: string
}
function AuthCard({ children, title, description }: Props) {
  return (
    <>
      <CardHeader className="p-0">
        <CardTitle className="h2-bold text-dark100_light900 wrap-break-word break-before-all lg:pr-15">
          {title}
        </CardTitle>
        {description !== null && (
          <CardDescription className="paragraph-regular line-clamp-2 ">
            {description}
          </CardDescription>
        )}
        <CardAction>
          <Link href="/">
            <Image
              src="/assets/images/site-logo.svg"
              alt="site icon"
              width={50}
              height={50}
              className="hover:scale-110 transition-all"
            />
          </Link>
        </CardAction>
      </CardHeader>
      {children}
    </>
  )
}

export default AuthCard
