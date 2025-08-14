'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

function Card({
  className,
  classObject,
  href,
  children,
}: PropsWithChildren & {
  className?: string;
  classObject?: string;
  href?: string;
}) {
  const cardClasses = cn(
    'flex w-full flex-col rounded-2xl bg-card p-5 shadow-lg dark:shadow-background shadow-neutral-400/10 border border-border transition-all duration-300 overflow-clip',
    className,
    classObject,
  );

  return href ? (
    <Link href={href}>
      <motion.div
        className={cardClasses}
        whileInView={{
          opacity: [0, 1],
          transition: {
            type: 'spring',
            stiffness: 200,
            damping: 20,
            duration: 0.4,
          },
        }}
      >
        {children}
      </motion.div>
    </Link>
  ) : (
    <motion.div
      animate={{
        opacity: [0, 1],
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 20,
          duration: 0.4,
        },
      }}
      className={cardClasses}
    >
      {children}
    </motion.div>
  );
}

export default Card;
