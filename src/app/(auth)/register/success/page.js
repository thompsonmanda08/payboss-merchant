import { Logo } from '@/components/base'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function Success() {
  return (
    <>
      <div className="m-auto flex max-w-[600px] flex-col items-center justify-center">
        <Link href={'/'} className="mx-auto mb-4 flex">
          <Logo />
        </Link>
        <h2
          className={
            'w-full bg-gradient-to-tr from-primary via-primary/80 to-primary-light bg-clip-text text-center text-[clamp(18px,18px+0.5vw,36px)] font-bold text-transparent'
          }
        >
          Account Created Successfully!
        </h2>
        <p className="py-4 pb-6 text-center text-sm leading-6 tracking-tight text-neutral-600 md:text-base ">
          <strong>Your account was created successfully!</strong> An email will
          be sent to you to verify your account. Approval takes{' '}
          <strong>
            up to <span class="font-semibold">24 hours</span>
          </strong>
          . You have access to your account with limited features until approval
          is completed.
        </p>

        <div className="grid w-full ">
          <Button as={Link} href={'/login'} className={'w-full flex-1'}>
            Login
          </Button>
        </div>
      </div>
    </>
  )
}
