import LeftSideBar from '@/components/shared/leftsidebar/LeftSideBar'
import Navbar from '@/components/shared/navbar/Navbar'
import RightSideBar from '@/components/shared/rightsidebar/RightSideBar'
import { Toaster } from '@/components/ui/sonner'
import { getSession } from '@/lib/actions/auth-action'
import React from 'react'

async function Layout({ children }: { children: React.ReactNode }) {
  const { session } = await getSession()
  return (
    <main className="background-light850_dark100 ">
      <Navbar session={session} />
      <div className="flex">
        <LeftSideBar session={session} />
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
        <RightSideBar />
      </div>
      <Toaster />
    </main>
  )
}

export default Layout
