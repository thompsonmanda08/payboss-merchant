import { forwardRef } from 'react';

const Progress = forwardRef<HTMLDivElement, { value: number; color: string }>(
  ({ value, color }, ref) => (
    <div ref={ref} className="h-2 w-full rounded-full bg-gray-200">
      <div
        className={`h-2 rounded-full bg-gradient-to-r   bg-${color}`}
        style={{ width: value + '%' }}
      />
    </div>
  ),
);

Progress.displayName = 'Progress';

export default Progress;
