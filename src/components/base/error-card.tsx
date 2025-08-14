'use client';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

import { Button } from '../ui/button';

import Logo from './payboss-logo';

export function ErrorCard({
  title,
  message,
  status = 400,
  href,
  handleReload,
  className,
  classNames,
  buttonText,
  goBack,
}: {
  title?: string;
  message?: string;
  status?: number | string;
  href?: string;
  handleReload?: () => void;
  className?: string;
  classNames?: {
    status?: string;
    title?: string;
    message?: string;
  };
  buttonText?: string;
  goBack?: boolean;
}) {
  const router = useRouter();

  return (
    <Card
      className={cn(
        'mx-auto aspect-square w-full max-w-sm flex-1 p-6 font-inter',
        className,
      )}
    >
      <CardHeader>
        <Logo
          className="mx-auto"
          classNames={{ wrapper: 'mx-auto' }}
          href="/"
        />
      </CardHeader>
      <CardBody className="flex cursor-pointer select-none flex-col items-center justify-center p-0">
        <p
          className={cn(
            'text-[clamp(32px,5vw,60px)] font-bold leading-normal text-primary-700',
            classNames?.status,
          )}
        >
          {status || '404'}
        </p>
        <h1
          className={cn(
            'text-lg font-semibold capitalize text-gray-900',
            classNames?.title,
          )}
        >
          {title || 'Page not found'}
        </h1>
        <p
          className={cn(
            'my-3 max-w-[300px] text-center text-sm font-medium text-foreground/70',
            classNames?.message,
          )}
        >
          {message || 'Sorry, we couldn’t find the page you’re looking for.'}
        </p>
      </CardBody>

      <CardFooter>
        {handleReload && !href ? (
          <Button
            className="w-full"
            onClick={() => {
              router.refresh();
              handleReload();
            }}
          >
            {buttonText || 'Reload'}
          </Button>
        ) : goBack ? (
          <Button className="w-full" onPress={() => router.back()}>
            Go back
          </Button>
        ) : (
          <Button as={Link} className="w-full" href={href || '/'}>
            Go home
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export function PermissionDenied() {
  const router = useRouter();

  return (
    <div className="flex-2 m-auto flex min-h-[50svh] w-full flex-1 items-center justify-center">
      <ErrorCard
        buttonText={'Go back'}
        handleReload={() => router.back()}
        message={'You do have the permissions to view this page'}
        status={'401'}
        title={'Permission Denied'}
      />
    </div>
  );
}

export function MissingConfigurationError() {
  const router = useRouter();

  return (
    <div className="flex-2 m-auto flex min-h-[50svh] w-full flex-1 items-center justify-center">
      <ErrorCard
        buttonText={'Go back'}
        handleReload={() => router.back()}
        message={
          'Start the action again to correctly set the configuration variables'
        }
        status={'Error'}
        title={'Missing Configuration'}
      />
    </div>
  );
}
