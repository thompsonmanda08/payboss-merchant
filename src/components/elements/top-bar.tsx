'use client';
import {
  ChatBubbleLeftRightIcon,
  MoonIcon,
  PowerIcon,
  SunIcon,
  WalletIcon,
} from '@heroicons/react/24/outline';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
  Switch,
} from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import React from 'react';

import BreadCrumbLinks from '@/components/base/breadcrumb';
import Avatar from '@/components/ui/avatar';
import NavIconButton from '@/components/ui/nav-icon-button';
import { Skeleton } from '@/components/ui/skeleton';
import useAuthStore from '@/context/auth-store';
import useNavigation from '@/hooks/use-navigation';
import { useWorkspaceInit } from '@/hooks/use-query-data';
import { capitalize, cn, formatCurrency } from '@/lib/utils';

export default function TopNavBar({ user }: any) {
  const params = useParams();
  const workspaceID = String(params.workspaceID);

  const { data: workspaceInit, isLoading } = useWorkspaceInit(workspaceID);
  const workspaceSession = workspaceInit?.data;

  const { isProfile, currentPath, dashboardRoute, router } =
    useNavigation(workspaceSession);

  const activeWorkspace =
    workspaceInit?.data?.activeWorkspace || workspaceSession?.activeWorkspace;

  const workspaceWalletBalance = activeWorkspace?.balance;

  if (isLoading || !workspaceID) return <NavbarLoader isProfile />;

  return (
    <nav
      className={cn(
        `rounded-blur top-navigation fixed left-0 right-0 top-5 z-50 flex w-full -translate-y-5 items-center rounded-xl bg-background/80 py-3 pr-5 shadow-sm backdrop-blur-md transition-all md:pl-2 lg:sticky lg:-top-2.5 lg:justify-start lg:shadow-none`,
      )}
    >
      <div className="flex w-full items-center">
        {/* LEFT SIDE */}
        <div
          className={cn(
            'relative left-16 hidden transition-all duration-300 ease-in-out lg:-left-3 lg:block',
          )}
        >
          <BreadCrumbLinks />
          <h2
            className={cn(
              'pl-2 text-lg font-bold uppercase leading-8 text-foreground/80',
            )}
          >
            {currentPath}
          </h2>
        </div>

        {/* FAR RIGHT SIDE */}
        <div
          className={cn(
            'relative z-50 ml-auto flex  items-center justify-center rounded-full',
          )}
        >
          <div
            className={cn('flex items-center gap-4 text-foreground-400', {})}
          >
            <Button
              className={cn(
                'flex group h-auto hover:bg-transparent cursor-pointer items-start gap-2 text-foreground-600',
              )}
              variant="light"
              onPress={() => {
                router.push(`${dashboardRoute}/workspace-settings?wallet=true`);
              }}
            >
              <span
                className={cn(
                  'rounded-lg w-9 h-9 grid place-items-center aspect-square bg-primary',
                )}
              >
                <WalletIcon className="h-5 w-5 text-white" />
              </span>

              <div className="flex flex-col items-start gap-1 ">
                <span className={cn('text-sm leading-4 tracking-wide')}>
                  Wallet Balance
                </span>
                <span className={cn('-mt-1 text-sm font-bold text-primary')}>
                  {formatCurrency(workspaceWalletBalance || '0.00')}
                </span>
              </div>
            </Button>
            {/* TODO: ENABLE NOTIFICATIONS IN THE FUTURE */}
            {/* <div className="relative flex cursor-pointer items-center gap-2 text-sm after:absolute after:-right-1 after:-top-1 after:aspect-square after:h-3 after:w-3 after:rounded-full after:bg-secondary after:content-['']">
              <NavIconButton className={"bg-primary"}>
                <BellIcon className="h-5 w-5 text-white" />
              </NavIconButton>
            </div> */}
            <AvatarDropdown
              isProfile={isProfile}
              user={user}
              workspaceSession={workspaceSession}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

export function AvatarDropdown({
  user,
  isProfile,
  workspaceSession,
}: {
  user: any;
  isProfile: boolean;
  workspaceSession: any;
}) {
  const queryClient = useQueryClient();

  const { handleUserLogOut } = useAuthStore((state) => state);

  const permissions = workspaceSession?.workspacePermissions;

  const { dashboardRoute } = useNavigation(workspaceSession);

  const { theme, setTheme } = useTheme();
  const [isSelected, setIsSelected] = React.useState(
    theme == 'dark' ? true : false,
  );

  return (
    <Dropdown
      // showArrow
      classNames={{
        base: 'before:bg-default-200 mr-5 min-w-60 dark:shadow-foreground ', // change arrow background
        content: cn(
          'p-0 border-sm border-divider bg-card border-[1px] border-border',
          {
            'bg-card/80 backdrop-blur-md': isProfile,
          },
        ),
      }}
      radius="sm"
    >
      <DropdownTrigger>
        <Button
          disableRipple
          isIconOnly
          className="rounded-full"
          variant="light"
        >
          <Avatar
            isProfile
            firstName={user?.first_name}
            lastName={user?.last_name}
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Custom item styles"
        // disabledKeys={['profile']}
        className="p-3"
        itemClasses={{
          base: [
            'rounded-md',
            'text-foreground/70',
            'transition-opacity',
            'data-[hover=true]:text-foreground',
            'data-[hover=true]:bg-primary-100',
            'dark:data-[hover=true]:bg-default-50',
            'data-[selectable=true]:focus:bg-default-50',
            'data-[pressed=true]:opacity-70',
            'data-[focus-visible=true]:ring-default-500',
          ],
        }}
      >
        <DropdownSection showDivider aria-label="Profile & Actions">
          <DropdownItem
            key="profile"
            isReadOnly
            className="h-12 gap-2 px-1"
            href={dashboardRoute + '/profile'}
          >
            <Avatar
              showUserInfo
              email={capitalize(permissions?.role || user?.role)}
              firstName={user?.first_name}
              lastName={user?.last_name}
            />
          </DropdownItem>
          {/* <DropdownItem key="Home" href="/workspaces">
            Exit to Workspaces
          </DropdownItem>
          <DropdownItem key="settings" href={settingsPathname + '/workspaces'}>
            Profile Settings
          </DropdownItem> */}
        </DropdownSection>

        <DropdownSection showDivider aria-label="Preferences">
          {/* <DropdownItem key="quick_search" shortcut="⌘K">
            Quick search
          </DropdownItem> */}

          <DropdownItem
            key="theme"
            isReadOnly
            className="flex cursor-default justify-between"
          >
            <div className="flex w-full cursor-default items-center justify-between">
              <span>Dark Mode</span>
              {/* <ThemeSwitcher /> */}
              <Switch
                defaultSelected
                color="primary"
                endContent={<MoonIcon />}
                isSelected={isSelected}
                size="md"
                startContent={<SunIcon />}
                onValueChange={(value) => {
                  setIsSelected(value);
                  setTheme(value ? 'dark' : 'light');
                }}
              >
                {/* Dark mode */}
              </Switch>
            </div>
          </DropdownItem>
        </DropdownSection>

        <DropdownSection aria-label="Help & Feedback">
          <DropdownItem key="Home" href="/workspaces" shortcut="⌘K">
            Go to Workspaces
          </DropdownItem>
          <DropdownItem key="help_and_feedback" href="/support">
            <div className="flex items-center justify-between">
              <span> Help & Support</span>{' '}
              <NavIconButton className={'scale-90'}>
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
              </NavIconButton>
            </div>
          </DropdownItem>
          <DropdownItem
            key="logout"
            onPress={() => {
              handleUserLogOut();
              queryClient.invalidateQueries();
            }}
          >
            <div className="flex items-center justify-between">
              <span>Log Out</span>{' '}
              <NavIconButton
                className={'scale-80 bg-primary'}
                onClick={() => {
                  handleUserLogOut();
                  queryClient.invalidateQueries();
                }}
              >
                <PowerIcon className="h-5 w-5 text-white" />
              </NavIconButton>
            </div>
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}

export function NavbarLoader({ isProfile }: { isProfile: boolean }) {
  return (
    <div className="relative -top-5 flex w-full justify-between">
      <div className="w-full">
        <Skeleton
          className={cn(
            'mb-2 aspect-square h-[5px] w-full max-w-xl rounded-lg',
            {
              'bg-foreground-200 p-4 backdrop-blur-md': isProfile,
            },
          )}
        />
        <Skeleton
          className={cn('aspect-square h-5 w-full max-w-xs rounded-lg', {
            'bg-foreground-200 p-4 backdrop-blur-md': isProfile,
          })}
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex space-x-2">
          <Skeleton
            className={cn('aspect-square h-8 rounded-full', {
              'bg-foreground-200 p-4 backdrop-blur-md': isProfile,
            })}
          />
          <Skeleton
            className={cn('aspect-square h-8 rounded-full', {
              'bg-foreground-200 p-4 backdrop-blur-md': isProfile,
            })}
          />
        </div>
        <Skeleton
          className={cn('aspect-square h-12 rounded-full', {
            'bg-foreground-200 p-4 backdrop-blur-md': isProfile,
          })}
        />
      </div>
    </div>
  );
}
