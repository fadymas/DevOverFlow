import React from 'react'
import { Card } from 'components/ui/card'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex  justify-center items-center min-h-screen w-full bg-[url(/assets/images/auth-light.png)] dark:bg-[url(/assets/images/auth-dark.png)] bg-cover bg-center">
      <Card className="w-130 rounded-[10px] py-10 px-8  gap-10 font-inter justify-between  background-light800_dark200">
        {children}
      </Card>
    </main>
  )
}
