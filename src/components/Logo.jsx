import Image from 'next/image'
import payBossLogo from '@/images/logos/payboss.svg'
import logoTuple from '@/images/logos/tuple.svg'

export function Logo(props) {
  return (
    <div className="h-12 max-h-12 ">
      <Image
        className="block h-full w-full object-contain "
        src={payBossLogo}
        width={100}
        height={48}
      />
    </div>
  )
}
