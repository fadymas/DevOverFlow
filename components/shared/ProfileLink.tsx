import Image from 'next/image'
import Link from 'next/link'
import * as motion from 'motion/react-client'
interface ProfileLinkProps {
  imgUrl: string
  href?: string
  title: string
}
function ProfileLink({ imgUrl, href, title }: ProfileLinkProps) {
  return (
    <motion.div
      className="flex-center gap-1 "
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 50 }}
    >
      <Image src={imgUrl} alt="icon" width={20} height={20} />
      {href ? (
        <Link href={href} target="_blank" className="text-blue-500 paragrah-medium ">
          {title}
        </Link>
      ) : (
        <p className="paragraph-medium text-dark400_light700 ">{title}</p>
      )}
    </motion.div>
  )
}

export default ProfileLink
