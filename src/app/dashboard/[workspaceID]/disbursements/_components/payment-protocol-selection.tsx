'use client';
import {
  ArrowRightCircle as ArrowRightCircleIcon,
  Layers as CircleStackIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect } from 'react';

import Modal from '@/components/modals/custom-modal';
import { Button } from '@/components/ui/button';
import CustomRadioGroup from '@/components/ui/custom-radio-group';
import usePaymentsStore from '@/context/payment-store';
import useNavigation from '@/hooks/use-navigation';
import { PAYMENT_PROTOCOL } from '@/lib/constants';
import { cn } from '@/lib/utils';

const SelectPaymentType = ({
  setCreatePaymentLoading,
}: {
  setCreatePaymentLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();

  const {
    openPaymentsModal,
    updatePaymentFields,
    setOpenPaymentsModal,
    setSelectedProtocol,
    selectedProtocol,
    setSelectedActionType,
  } = usePaymentsStore();

  const { dashboardRoute } = useNavigation();

  const PAYMENT_SERVICE_TYPES = [
    {
      name: 'Bulk Disbursement',
      Icon: CircleStackIcon,
      href: `${dashboardRoute}/disbursements/create/bulk`,
      index: 0,
    },
    {
      name: 'Single Disbursement',
      Icon: ArrowRightCircleIcon,
      href: `${dashboardRoute}/disbursements/create/single`,
      index: 1,
    },
  ];

  function handleSelectServiceType(type: any) {
    setCreatePaymentLoading(true);
    updatePaymentFields({ type: type?.name });
    setSelectedActionType(type);

    // router.push(`${type.href}/?protocol=${selectedProtocol}`)
    router.push(`payments/create/${selectedProtocol}`);
    setOpenPaymentsModal(false);
  }

  function handleProtocolSelection(option: number) {
    setSelectedProtocol(PAYMENT_PROTOCOL[option]);
    updatePaymentFields({ protocol: PAYMENT_PROTOCOL[option] });
  }

  useEffect(() => {
    if (!selectedProtocol) {
      setSelectedProtocol(PAYMENT_PROTOCOL[0]);
    }
  }, []);

  return (
    <>
      {/************************* MAIN MODAL RENDERER *************************/}
      <Modal
        confirmText={'Proceed'}
        infoText={'Choose a payment you would like to initiate'}
        show={openPaymentsModal}
        title={'Create a payment'}
        width={500}
        onClose={() => {
          setOpenPaymentsModal(false);
        }}
        onConfirm={() => {
          handleSelectServiceType(PAYMENT_SERVICE_TYPES[0]);
        }}
      >
        <div className="flex h-full w-full flex-col justify-between">
          <div className="">
            <CustomRadioGroup
              className={'bg-slate-50/20 py-5 text-base'}
              classNames={{
                selected:
                  'bg-primary/10 border border-primary/30 hover:shadow-primary/20',
              }}
              // defaultValue={PAYMENT_PROTOCOL[0]}
              labelText="Select a service protocol"
              options={PAYMENT_PROTOCOL?.map((item, index) => (
                <div key={index} className="flex flex-1 capitalize">
                  <span className="font-medium">{item}</span>
                </div>
              ))}
              onChange={(option: number) => handleProtocolSelection(option)}
            />
          </div>

          {/* <div className="flex h-5/6 w-full items-center gap-2">
            {PAYMENT_SERVICE_TYPES.map((type, index) => {
              return (
                <PaymentTypeOption
                  key={index}
                  fieldOption={type?.name}
                  Icon={type?.Icon}
                  href={type?.href}
                  selected={paymentAction?.type == type?.name}
                  handleSelect={() => handleSelectServiceType(type)}
                />
              )
            })}
          </div> */}
        </div>
      </Modal>
    </>
  );
};

function PaymentTypeOption({
  fieldOption,
  selected,
  handleSelect,
  Icon,
  className,
}: {
  fieldOption: string;
  selected: boolean;
  handleSelect: () => void;
  Icon: React.ElementType;
  className?: string;
}) {
  return (
    <Button
      className={cn(
        `relative flex aspect-square h-40 max-h-40 flex-1 cursor-pointer items-center justify-center rounded-md border border-primary-100 bg-background p-5 text-[24px] tracking-tighter text-primary transition-colors duration-200 ease-in-out`,
        className,
        {
          'bg-primary text-white shadow-xl shadow-slate-500/10': selected,
        },
      )}
      onClick={handleSelect}
    >
      <Icon
        className={cn(
          'absolute left-20 z-0 scale-[2.5] font-bold text-gray-200/50 transition-all duration-150 ease-in-out',
          {
            'left-10': selected,
          },
        )}
      />
      <span className="z-10 font-bold">{fieldOption}</span>
    </Button>
  );
}

export default SelectPaymentType;
