import { useRouter } from 'next/navigation'
import React from 'react'

function Error({ title, message, status, href, handleReload }) {
  const router = useRouter()
  return (
    <Card className="mx-auto -mt-40 aspect-square w-full max-w-sm flex-auto p-6 font-inter">
      <CardHeader>
        <Logo href="/" className="mx-auto" containerClasses={'mx-auto'} />
      </CardHeader>
      <CardContent className="flex cursor-pointer select-none flex-col items-center justify-center p-0">
        <p className="text-[clamp(32px,5vw,60px)] font-bold leading-normal text-primary-700">
          {status || '404'}
        </p>
        <h1 className="text-lg font-semibold capitalize text-gray-900">
          {title || 'Page not found'}
        </h1>
        <p className="my-3 max-w-[300px] text-center text-sm font-medium text-slate-700">
          {message || 'Sorry, we couldn’t find the page you’re looking for.'}
        </p>
      </CardContent>

      <CardFooter>
        {handleReload && !href ? (
          <Button
            className="w-full"
            onClick={() => {
              router.refresh()
            }}
          >
            Reload
          </Button>
        ) : (
          <Link href={href || '/'} className="w-full">
            <Button className="w-full">Go back home</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}

export default Error
