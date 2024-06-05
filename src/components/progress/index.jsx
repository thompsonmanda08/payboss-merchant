import { forwardRef } from "react";

const Progress = forwardRef(({ value, color='black/80' }, ref) => (
<div className="w-full bg-gray-200 rounded-full h-2 w-full" ref={ref}>
  <div className={`bg-${color}  h-2 rounded-full w-[${value}%]`}></div>
</div>

));

export default Progress;
