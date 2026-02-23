'use client'
import { Button } from '@/components/ui/button'
import { sidebarLinks } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { serverSession } from '@/lib/auth/auth-client'
import CustomUserAvatar from '../CustomUserAvatar'

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
            className={`  p-4 rounded-lg gap-2.5  flex font-inter justify-center lg:justify-start  ${isActive ? 'primary-gradient rounded-lg text-light-900' : 'text-dark300_light900'} `}
          >
            <Image
              src={manu.imgURL}
              alt={manu.label}
              width={24}
              height={24}
              className={`${isActive ? '' : 'invert-colors'}`}
            />
            <p className={`${isActive ? 'base-bold' : 'base-medium'} hidden lg:block`}>
              {manu.label}
            </p>
          </Link>
        )
      })}
    </div>
  )
}

interface LeftSideBarProps {
  session: serverSession | null
}
function LeftSideBar({ session }: LeftSideBarProps) {
  const pathname = usePathname()
  const isActive = pathname === `/profile/${session?.user.id}`

  return (
    <aside className=" justify-start items-center gap-7 flex-col p-[150px_24px_36px_24px]  sticky left-0 top-0  min-h-screen  background-light900_dark200 hidden sm:flex  border-r shadow-[10px_10px_20px_rgba(218,213,213,0.1)] ">
      <div className=" flex flex-col gap-18 self-stretch min-w-6">
        <SideBarContent />
      </div>
      <div className=" self-stretch flex flex-col gap-3 ">
        {session?.user ? (
          <div>
            <Link href={`/profile/${session.user.id}`} className="flex justify-center">
              {session.user.image ? (
                <Image
                  src={session.user.image as string}
                  alt="user"
                  width={100}
                  height={100}
                  className={` rounded-full min-w-lg:w-100 xs:w-14 lg:w-25  ${isActive ? 'xs:border-2 lg:border-4 border-primary-500' : ''}`}
                />
              ) : (
                <CustomUserAvatar name={session.user.name} isActive={isActive} />
              )}
            </Link>
          </div>
        ) : (
          <>
            <Link href="/sign-in">
              <Button className="w-full rounded-lg  shadow-none h-14 background-light800_dark200">
                <span className="primary-text-gradient max-lg:hidden base-medium font-inter ">
                  Log In
                </span>
                <Image
                  src="/assets/icons/account.svg"
                  alt="login"
                  width={24}
                  height={24}
                  className="invert-colors lg:hidden"
                />
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                className="w-full h-14 rounded-lg shadow-none background-light800_dark200
               "
              >
                <span className="max-lg:hidden base-medium font-inter  primary-text-gradient ">
                  Sign up
                </span>
                <Image
                  src="/assets/icons/sign-up.svg"
                  alt="login"
                  width={24}
                  height={24}
                  className="invert-colors lg:hidden"
                />
              </Button>
            </Link>
          </>
        )}
      </div>
    </aside>
  )
}

export default LeftSideBar
