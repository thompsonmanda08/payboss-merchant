'use client'
import { Switch } from '@headlessui/react';
import { useState } from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const ToggleSwitch = () => {
  const [enabled, setEnabled] = useState(false);
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={classNames(
        'relative inline-flex bg-primary p-1 flex-shrink-0 2xl:h-[28px] 2xl:w-14  xl:w-12 xl:h-[24px] rounded-[4px] border-transparent  cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ',
      )}
    >
      <span className='sr-only'>On</span>
      <span
        className={classNames(
          enabled
            ? '2xl:translate-x-6 xl:translate-x-5 translate-x-5'
            : 'translate-x-0',
          'pointer-events-none relative inline-block h-full w-[50%] rounded-[3px] bg-white transform ring-0 transition ease-in-out duration-200',
        )}
      >
        <span
          className={classNames(
            enabled
              ? 'opacity-0 ease-out duration-100'
              : 'opacity-100 ease-in duration-200',
            'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity',
          )}
          aria-hidden='true'
        ></span>
        <span
          className={classNames(
            enabled
              ? 'opacity-100 ease-in duration-200'
              : 'opacity-0 ease-out duration-100',
            'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity',
          )}
          aria-hidden='true'
        ></span>
      </span>
      <span
        className={` font-bold 2xl:text-[13px] xl:text-[10px] text-white absolute left-1`}
      >
        On
      </span>
      <span
        className={` font-bold 2xl:text-[13px] xl:text-[10px] text-white mx-1`}
      >
        Off
      </span>
    </Switch>
  );
};
export default ToggleSwitch;