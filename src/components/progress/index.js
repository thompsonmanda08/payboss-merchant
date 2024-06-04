import { forwardRef } from "react";

const Progress = forwardRef(({ value, }, ref) => (
<div className="w-full bg-gray-200 rounded-full h-2 w-full" ref={ref}>
  <div className={`bg-black/80  h-2 rounded-full w-[${value}%]`}></div>
</div>

));

export default Progress;
