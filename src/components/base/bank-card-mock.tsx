import { Card, CardBody, CardHeader, Chip } from '@heroui/react';
import React from 'react';

import Logo from './payboss-logo';

function BankCard({ formData }: { formData: any }) {
  return (
    <Card
      isBlurred
      className="max-w-md mx-8 my-2 bg-gradient-to-tr from-black to-blue-800 text-white"
      shadow="md"
    >
      <CardHeader className="flex justify-between">
        <Logo isWhite />
        <Chip
          className="bg-gradient-to-r  from-orange-400 via-orange-300 to-orange-400 "
          classNames={{
            content: 'text-black font-bold',
          }}
          color="warning"
          variant="solid"
        >
          GOLD
        </Chip>
      </CardHeader>

      <CardBody>
        <div className="pb-2">
          <p className="text-small opacity-70">Card Number</p>
          <p className="text-xl tracking-widest">**** **** **** 4848</p>
        </div>

        <div className="flex justify-between pb-2">
          <div>
            <p className="text-small opacity-70">Card Holder</p>
            <p>
              {formData?.firstName || formData?.lastName
                ? `${formData?.firstName} ${formData?.lastName}`
                : 'Full Name'}
            </p>
          </div>
          <div>
            <p className="text-small opacity-70">Expires</p>
            <p>XX/XX</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default BankCard;
