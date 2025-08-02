import Link from "next/link"
import Image from "next/image"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="#" className={`relative flex items-center justify-center ${className}`}>
      <Image src="/images/customsite-pro-logo.png" alt="CustomSite Pro Logo" fill className="object-contain" />
    </Link>
  )
}
