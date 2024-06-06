import { forwardRef } from 'react'

const Progress = forwardRef(({ value , color}, ref) => (
  <div className="h-2 w-full rounded-full bg-gray-200" ref={ref}>
    <div
      style={{ width: value + '%' }}
      className={`h-2 rounded-full bg-gradient-to-r   bg-${color}`}
    ></div>
  </div>
))

export default Progress
