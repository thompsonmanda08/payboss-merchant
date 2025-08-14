'use client';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

function StatusMessage({
  error = false,
  status = 'error',
  message = 'Error Message',
}) {
  return (
    <motion.div
      className={cn(
        `${
          error
            ? 'bg-rose-500/10 text-rose-600'
            : 'bg-green-500/10 text-green-600'
        } my-2 flex min-h-[60px] w-full items-center justify-center rounded-lg p-4 px-5`,

        {
          'bg-rose-500/10 text-rose-600': status == 'error',
          'bg-green-500/10 text-green-600': status == 'success',
          'bg-primary/10 text-primary': status == 'info',
        },
      )}
      whileInView={{
        opacity: [0, 1],
        // scale: [0, 1],
        transition: {
          duration: 0.5,
          ease: 'easeInOut',
        },
      }}
    >
      <p className={`text-xs font-semibold md:text-sm`}>{message}!</p>
    </motion.div>
  );
}

export default StatusMessage;
