'use client';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import { User, Mail, Phone, Edit, Briefcase } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui/button';
import useKYCInfo from '@/hooks/use-kyc-info';
import { useWorkspaceInit } from '@/hooks/use-query-data';
import { capitalize, cn } from '@/lib/utils';
import { User as UserType } from '@/types/account';

export default function UserProfile({
  showBusinessDetails = false,
  onEditProfile,
  user = {
    first_name: 'Pay',
    last_name: 'Boss',
    email: 'info@bgspayboss.com',
    phone: '+260 977 777 777',
    profile_image: undefined,
    role: 'Member',
  },
  classNames = {
    card: '',
  },
}: {
  showBusinessDetails?: boolean;
  onEditProfile?: () => void;
  user: Partial<UserType>;
  classNames?: {
    card?: string;
  };
}) {
  const { businessDetails } = useKYCInfo();

  const params = useParams();
  const workspaceID = params?.workspaceID;

  const { data: workspaceInit } = useWorkspaceInit(String(workspaceID));

  const workspaceSession = workspaceInit?.data;
  const permissions = workspaceSession?.workspacePermissions;

  return (
    <Card
      className={cn(
        'max-w-[360px] mx-auto flex-1 overflow-hidden border-none outline-none shadow',
        classNames?.card,
      )}
    >
      {/* Header with gradient background */}
      <CardHeader className="p-0 relative">
        {/* Edit Profile Button */}
        {onEditProfile && (
          <Button
            isIconOnly
            className="gap-2 absolute right-4 top-4 bg-white/10 backdrop-blur-sm border-none outline-none "
            size={'lg'}
            variant="faded"
            onClick={onEditProfile}
          >
            <Edit className="w-5 h-5 text-white" />
          </Button>
        )}
        <div className="bg-gradient-to-tr from-primary to-blue-300 px-6 py-8 pb-4 text-center w-full">
          {/* Profile Image */}
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
              {user.profile_image ? (
                <img
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-full h-full rounded-full object-cover"
                  src={user.profile_image}
                />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            {/* Online status indicator */}
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-400 rounded-full border-3 border-white" />
          </div>

          {/* User Name */}
          <h2 className="text-2xl font-bold text-white mt-4">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-blue-100 capitalize">
            {capitalize(permissions?.role || user?.role)}
          </p>
        </div>
      </CardHeader>

      {/* Profile Information */}
      <CardBody className="p-6 space-y-4">
        {showBusinessDetails && businessDetails?.name && (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <div className="w-10 h-10 bg-blue-100 aspect-square rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 font-medium">Business Name</p>
              <p className="text-gray-900 font-bold">{businessDetails?.name}</p>
            </div>
          </div>
        )}
        {/* Email */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <div className="w-10 h-10 bg-blue-100 aspect-square rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 font-medium">Email Address</p>
            <p className="text-gray-900 font-medium">{user.email}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <div className="w-10 h-10 bg-emerald-100 aspect-square rounded-lg flex items-center justify-center">
            <Phone className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 font-medium">Phone Number</p>
            <p className="text-gray-900 font-medium">{user?.phone}</p>
          </div>
        </div>
      </CardBody>
      <CardFooter className="pt-0">
        {onEditProfile && (
          <Button className="w-full gap-2" size={'lg'} onClick={onEditProfile}>
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
