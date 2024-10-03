import Link from 'next/link'
import React from 'react'

function MiniFooter() {
  return (
    <footer className="py-12">
      <div className="container">
        <div className="-mx-3 flex flex-wrap">
          <div className="lg:flex-0 mx-auto mb-6 w-full max-w-full flex-shrink-0 text-center lg:w-8/12">
            <Link
              href="javascript:;"
              target="_blank"
              className="mb-2 mr-4 text-slate-400 sm:mb-0 xl:mr-12"
            >
              {' '}
              Company{' '}
            </Link>
            <Link
              href="javascript:;"
              target="_blank"
              className="mb-2 mr-4 text-slate-400 sm:mb-0 xl:mr-12"
            >
              {' '}
              About Us{' '}
            </Link>
            <Link
              href="javascript:;"
              target="_blank"
              className="mb-2 mr-4 text-slate-400 sm:mb-0 xl:mr-12"
            >
              {' '}
              Team{' '}
            </Link>
            <Link
              href="javascript:;"
              target="_blank"
              className="mb-2 mr-4 text-slate-400 sm:mb-0 xl:mr-12"
            >
              {' '}
              Products{' '}
            </Link>
            <Link
              href="javascript:;"
              target="_blank"
              className="mb-2 mr-4 text-slate-400 sm:mb-0 xl:mr-12"
            >
              {' '}
              Blog{' '}
            </Link>
            <Link
              href="javascript:;"
              target="_blank"
              className="mb-2 mr-4 text-slate-400 sm:mb-0 xl:mr-12"
            >
              {' '}
              Pricing{' '}
            </Link>
          </div>
          <div className="lg:flex-0 mx-auto mb-6 mt-2 w-full max-w-full flex-shrink-0 text-center lg:w-8/12">
            <Link
              href="javascript:;"
              target="_blank"
              className="mr-6 text-slate-400"
            >
              <span className="fab fa-dribbble text-lg"></span>
            </Link>
            <Link
              href="javascript:;"
              target="_blank"
              className="mr-6 text-slate-400"
            >
              <span className="fab fa-twitter text-lg"></span>
            </Link>
            <Link
              href="javascript:;"
              target="_blank"
              className="mr-6 text-slate-400"
            >
              <span className="fab fa-instagram text-lg"></span>
            </Link>
            <Link
              href="javascript:;"
              target="_blank"
              className="mr-6 text-slate-400"
            >
              <span className="fab fa-pinterest text-lg"></span>
            </Link>
            <Link
              href="javascript:;"
              target="_blank"
              className="mr-6 text-slate-400"
            >
              <span className="fab fa-github text-lg"></span>
            </Link>
          </div>
        </div>
        <div className="-mx-3 flex flex-wrap">
          <div className="flex-0 mx-auto mt-1 w-8/12 max-w-full px-3 text-center">
            <p className="mb-0 text-slate-400">
              Copyright ©{new Date().getFullYear()} PayBoss. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default MiniFooter
