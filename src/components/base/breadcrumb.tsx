'use client';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import useNavigation from '@/hooks/use-navigation';
import useWorkspaces from '@/hooks/use-workspaces';
import { cn } from '@/lib/utils';

export default function BreadCrumbLinks() {
  const router = useRouter();
  const { pathname, pathArr } = useNavigation();
  const { workspaces, workspaceID } = useWorkspaces();

  const [path, setPath] = useState(['']);

  useEffect(() => {
    /********************* WORKSPACE NAME ********************** */
    if (pathArr.length > 2 && pathname?.startsWith('/dashboard')) {
      const workspace = workspaces?.find(
        (item) => item?.ID == workspaceID,
      )?.workspace;

      pathArr[2] = String(workspace);
    }
    /***************************************************************** */

    setPath([...pathArr.filter((path) => path !== '')]);
  }, [pathname, workspaceID]);

  return (
    <div className="hidden w-full justify-between text-xs md:flex ">
      <div className="flex pr-1 pt-1">
        {path &&
          path.map((segment, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <div
                className={cn(
                  ` cursor-pointer px-2 font-medium capitalize text-slate-400`,
                  {
                    'text-foreground/70': idx === path.length - 1,
                  },
                )}
              >
                {segment?.replace(/-|%20/g, ' ')}
              </div>
              {idx < path.length - 1 && (
                <ChevronRightIcon
                  className={cn(
                    'h-3 w-3 text-foreground/50 hover:text-primary',
                  )}
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
