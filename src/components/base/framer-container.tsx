"use client";
import Image from "next/image";

import { cn } from "@/lib/utils";
// import { Image } from '@heroui/react'

export default function FrameContainer({ image, description, className }: {
  image: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex aspect-[16/9] max-h-[620px] items-center justify-center overflow-clip rounded-[32px] border-[12px] border-[#1b1b1b] object-cover shadow-xl",
        className,
      )}
      id="showcase"
    >
      <Image
        alt={`Image of: ${description}`}
        className="absolute -top-5 h-full w-full object-contain"
        height={720}
        loading="lazy"
        src={image}
        width={1280}
      />
    </div>
  );
}
