'use client'
import { Button } from '@/components/ui/button'
import { sidebarLinks } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function SideBarContent() {
  const pathname = usePathname()

  return (
    <div className="list gap-6 flex flex-col">
      {sidebarLinks.map((manu) => {
        const isActive =
          (pathname.includes(manu.route) && manu.route.length > 1) || pathname === manu.route
        return (
          <Link
            href={manu.route}
            key={manu.label}
            className={` p-4 rounded-lg gap-2.5  flex font-inter  ${isActive ? 'primary-gradient rounded-lg text-light-900' : 'text-dark300_light900'} `}
          >
            <Image
              src={manu.imgURL}
              alt={manu.label}
              width={24}
              height={24}
              className={`${isActive ? '' : 'invert-colors'}`}
            />
            <p className={`${isActive ? 'base-bold' : 'base-medium'} hidden md:block`}>
              {manu.label}
            </p>
          </Link>
        )
      })}
    </div>
  )
}
function LeftSideBar() {
  return (
    <aside className=" justify-between items-center flex-col p-[40px_24px_36px_24px]  sticky left-0 top-0  min-h-screen  background-light900_dark200 hidden sm:flex  border-r shadow-[10px_10px_20px_rgba(218,213,213,0.1)] ">
      <div className=" flex flex-col gap-18 self-stretch">
        <div>
          <Link href="/" className="flex gap-[4.76px] font-spaceGrotesk">
            <Image
              src="/assets/images/site-logo.svg"
              alt="DevFlow"
              width={31.32}
              height={31.32}
              className=""
            />
            <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900  h2-bold hidden md:flex">
              Dev <span className="text-primary-500">Overflow </span>
            </p>
          </Link>
        </div>
        <SideBarContent />
      </div>
      <div className="down self-stretch flex flex-col gap-3 ">
        <Link href="/sign-in">
          <Button className=" btn-secondary w-full rounded-lg  shadow-none h-14">
            <span className="primary-text-gradient max-md:hidden base-medium font-inter">
              Log In
            </span>
            <Image
              src="assets/icons/account.svg"
              alt="login"
              width={24}
              height={24}
              className="invert-colors md:hidden"
            />
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button className="  btn-tertiary light-border-2 w-full h-14  rounded-lg shadow-none text-dark400_light900 border">
            <span className="max-md:hidden base-medium font-inter">Sign up</span>
            <Image
              src="assets/icons/sign-up.svg"
              alt="login"
              width={24}
              height={24}
              className="invert-colors md:hidden"
            />
          </Button>
        </Link>
      </div>
    </aside>
  )
}

export default LeftSideBar
