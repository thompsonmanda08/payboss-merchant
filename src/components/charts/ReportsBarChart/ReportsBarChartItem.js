import Progress from '@/components/progress';
import React from 'react';

function ReportsBarChartItem({icon, label, progress }) {
  return (
    <div className="w-full">
      <div className="flex items-center mb-2">
        <div
          className={`bg-${icon.color} w-5 h-5 rounded-sm text-white text-xs flex justify-center items-center shadow-md mr-1`}
        >
          <span>{icon.component}</span>
        </div>
        <span className="text-caption capitalize font-medium text-gray-800">
          {label}
        </span>
      </div>
      <div className="mt-1">
        <h4 className='font-bold text-black'>
          {progress.content}
        </h4>
        <div className="w-3/4 mt-1">
          
            <Progress value={progress.percentage}/>
          
        </div>
      </div>
    </div>
  );
}

export default ReportsBarChartItem;
