'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
// import { Image } from '@heroui/react'

export default function FrameContainer({ image, description, className }) {
  return (
    <div
      id="showcase"
      className={cn(
        'relative flex aspect-[16/9] max-h-[620px] items-center justify-center overflow-clip rounded-[32px] border-[12px] border-[#1b1b1b] object-cover shadow-xl',
        className,
      )}
    >
      <Image
        loading="lazy"
        src={image}
        className="absolute -top-5 h-full w-full object-contain"
        alt={`Image of: ${description}`}
        width={1280}
        height={720}
      />
    </div>
  )
}
