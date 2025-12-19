import LeftSideBar from '@/components/shared/leftsidebar/LeftSideBar'
import Navbar from '@/components/shared/navbar/Navbar'
import RightSideBar from '@/components/shared/rightsidebar/RightSideBar'
import React from 'react'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="background-light850_dark100 ">
      <Navbar />
      <div className="flex">
        <LeftSideBar />
        <section className="flex min-h-scre en flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
        <RightSideBar />
      </div>
      {/* Toaster */}
    </main>
  )
}

export default Layout
