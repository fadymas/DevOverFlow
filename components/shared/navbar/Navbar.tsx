import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Theme from './Theme'
import MobileNav from './MobileNav'
import GlobalSearch from '../search/GlobalSearch'

function Navbar() {
  return (
    <nav className="flex justify-between items-center background-light900_dark200 fixed z-50 w-full gap-5 py-6 px-3 shadow-light-300 dark:shadow-none sm:px-6  right-0 ">
      <Link href="/" className="flex items-center gap-1 justify-center ">
        <Image
          src="/assets/images/site-logo.svg"
          alt="DevFlow"
          width={18}
          height={18}
          className=" sm:w-8 sm:h-8"
        />
        <p className="font-medium sm:font-bold sm:text-2xl font-spaceGrotesk text-dark-100 dark:text-light-900 flex">
          Dev <span className="text-primary-500 font-bold sm:text-2xl">Overflow</span>
        </p>
      </Link>
      <GlobalSearch />
      <div className="flex-between gap-5">
        <Theme />
        <MobileNav />
      </div>
    </nav>
  )
}

export default Navbar
