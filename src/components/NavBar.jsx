'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

function NavBar() {
  return (
    <header>
      <nav class="shadow-soft-2xl rounded-blur absolute left-0 right-0 top-0 z-30 mx-6 my-4 flex flex-wrap items-center bg-white/80 px-4 py-2 backdrop-blur-2xl backdrop-saturate-200 lg:flex-nowrap lg:justify-start"></nav>
    </header>
  )
}

export default NavBar
