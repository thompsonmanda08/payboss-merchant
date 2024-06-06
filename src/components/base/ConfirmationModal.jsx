import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import { Fragment, useRef } from 'react';
import { Button } from '../ui/Button';



const ConfirmationModal = ({
  title,
  content,
  show = false,
  setShow,
  onConfirm,
  confirmText,
}) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition show={show} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 z-[99999] overflow-y-auto'
        initialFocus={cancelButtonRef}
        onClose={setShow}
      >
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-[0.5]' />
        </TransitionChild>

        <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <DialogPanel className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                <div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                  <div className='sm:flex sm:items-start'>
                    <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
                      <ExclamationTriangleIcon
                        className='h-6 w-6 text-red-600'
                        aria-hidden='true'
                      />
                    </div>
                    <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
                      <DialogTitle className='text-base font-semibold leading-6 text-gray-900'>
                        {title}
                      </DialogTitle>
                      <div className='mt-2'>
                        <p className='text-md text-gray-500'>{content}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='bg-gray-50 px-4 py-3 flex justify-end sm:px-6 gap-x-4'>
                <Button
                    type='button'
                    className='bg-red-500 hover:bg-red-300'
                    onClick={() => setShow(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='button'
                    onClick={onConfirm}
                  >
                    {confirmText || 'Delete'}
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmationModal;
