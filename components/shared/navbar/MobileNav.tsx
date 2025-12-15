'use client'
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { sidebarLinks } from '@/constants'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

function NavContent() {
  const pathname = usePathname()
  return (
    <section className="flex h-full flex-col gap-6 pt-16">
      {sidebarLinks.map((item) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route
        return (
          <SheetClose asChild key={item.route}>
            <Link
              href={item.route}
              className={`${isActive ? 'primary-gradient rounded-lg text-light-900' : 'text-dark300_light900'} flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={`${isActive ? '' : 'invert-colors'}`}
              />
              <p className={`${isActive ? 'base-bold' : 'base-medium'}`}>{item.label}</p>
            </Link>
          </SheetClose>
        )
      })}
    </section>
  )
}
function MobileNav() {
  const [open, setOpen] = useState(false)
  return (
    <Sheet
      onOpenChange={() => {
        setOpen(!open)
      }}
    >
      <SheetTrigger asChild>
        <Image
          src={`${open ? 'assets/icons/close.svg' : 'assets/icons/hamburger.svg'}`}
          alt="Menu"
          width={36}
          height={36}
          className="invert-colors sm:hidden"
        />
      </SheetTrigger>
      <SheetContent side="left" className="background-light900_dark200 border-none pt-4 px-2  w-65">
        <Link href="/" className="flex items-center gap-1 pt-2">
          <Image src="/assets/images/site-logo.svg" width={23} height={23} alt="DevFlow" />
          <SheetTitle className="h2-bold text-dark100_light900 font-spaceGrotesk">
            Dev <span className="text-primary-500">Overflow</span>
          </SheetTitle>
        </Link>
        <div>
          <NavContent />
        </div>

        <div className="flex flex-col gap-3">
          <SheetClose asChild>
            <Link href="/sign-in">
              <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                <span className="primary-text-gradient">Log In</span>
              </Button>
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/sign-up">
              <Button className="small-medium btn-tertiary light-border-2 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none text-dark400_light900 border">
                Sign Up
              </Button>
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNav
