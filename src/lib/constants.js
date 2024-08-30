import IMG from '@/images/placeholder-image.webp'
import DefaultCover from '@/images/profile-cover.jpg'
import {
  ArrowRightCircleIcon,
  CircleStackIcon,
  WalletIcon,
} from '@heroicons/react/24/outline'

const BASE_URL = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL
// const POCKET_BASE_URL =
//   process.env.POCKET_BASE_URL || process.env.NEXT_PUBLIC_POCKET_BASE_URL

const POCKET_BASE_URL = 'https://payboss-uat-backend.bgsgroup.co.zm'

const AUTH_SESSION = 'pb-session'
const USER_SESSION = 'pb-next-usr'
const WORKSPACE_SESSION = 'pb-next-workspace'

const placeHolderImage = IMG

// QUERY KEYS
const USER_DATA_KEY = 'user-query-data'
const CONFIGS_QUERY_KEY = 'configs-query-data'
const USER_ROLES_QUERY_KEY = 'user-roles-query-data'
const USERS = 'users-query-data'
const SETUP_QUERY_KEY = 'setup-query-data'
const WORKSPACES_QUERY_KEY = 'workspaces-query-data'
const WORKSPACE_ROLES_QUERY_KEY = 'workspace-role-query-data'
const WORKSPACE_DASHBOARD_QUERY_KEY = 'dashboard-query-data'
const WORKSPACE_MEMBERS_QUERY_KEY = 'members-query-data'
const DIRECT_BULK_TRANSACTIONS_QUERY_KEY = 'direct-bulk-query-data'
const BATCH_DETAILS_QUERY_KEY = 'batch-details-query-data'
const WALLET_HISTORY_QUERY_KEY = 'wallet-history-details-query-data'

// ANIMATION_VARIANTS
const staggerContainerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
    },
  },
  exit: { opacity: 0 },
}

const staggerContainerItemVariants = {
  hidden: { opacity: 0, y: -60 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 60 },
}

// REGEX
const MTN_NO = /^0(95|96|97|76|77|75)[0-9]{7}$/
const AIRTEL_NO = /^0(95|96|97|76|77|75)[0-9]{7}$/
const ZAMTEL_NO = /^0(95|96|97|76|77|75)[0-9]{7}$/
// const NRC_PASSPORT = /^(ZN[0-9]{6}|[0-9]{6}/[0-9]{2}/[1]{1})$/

// const MTN_NO = /^(?:\+?26|26)?(096|076)\d{7}$/
// const AIRTEL_NO = /^(?:\+?26|26)?(097|077)\d{7}$/
// const ZAMTEL_NO = /^(?:\+?26|26)?(095|075)\d{7}$/

const PASSWORD_PATTERN =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/

const PAYMENT_SERVICE_TYPES = [
  {
    name: 'Bulk Payments',
    Icon: CircleStackIcon,
    index: 0,
  },
  {
    name: 'Single Payments',
    Icon: ArrowRightCircleIcon,
    index: 1,
  },
]

const PAYMENT_SERVICE = ['direct', 'voucher']

const TASK_ICON_BG_COLOR_MAP = {
  Call: 'bg-[#F7F6FF]',
  Task: 'bg-[#FFF8F1]',
  Note: 'bg-[#92b76229]',
  Email: 'bg-[#F0FFFF]',
  Tag: 'bg-[#F7F6FF]',
  Deposit: 'bg-[#58FF5F]',
}

const TRANSACTION_STATUS_COLOR_MAP = {
  submitted: 'from-primary/10 to-primary-700/10 text-primary-700',
  review: 'from-secondary/10 to-orange-600/10 text-orange-700',
  failed: 'from-red-500/10 to-red-600/10 text-red-700',
  canceled: 'from-red-500/10 to-red-600/10 text-red-700',
  rejected: 'from-red-500/10 to-red-600/10 text-red-700',
  succeeded: 'from-[#58FF5F]/10 to-green-500/10 text-green-700',
  approved: 'from-[#58FF5F]/10 to-green-500/10 text-green-700',
}

const TASK_TYPE = {
  // Call: {
  //   icon: <DevicePhoneMobileIcon className="h-5 w-5" />,
  //   color: 'violet-800',
  //   label: 'Call',
  // },
  // Task: {
  //   icon: <DocumentArrowDownIcon className="h-5 w-5" />,
  //   color: 'orange-900',
  //   label: 'Task',
  // },
  // Note: {
  //   icon: <PencilSquareIcon className="h-5 w-5" />,
  //   color: 'orange-900',
  //   label: 'Note',
  // },
  // Email: {
  //   icon: <InboxArrowDownIcon className="h-5 w-5" />,
  //   color: 'cyan-900',
  //   label: 'Email',
  // },
  // Tag: {
  //   icon: <TagIcon className="h-5 w-5" />,
  //   color: 'black/60',
  //   label: 'Tag',
  // },
  Deposit: {
    icon: <WalletIcon className="h-5 w-5" />,
    color: 'green-600',
    label: 'Deposit',
  },
}

// ***************** EXPORTS ******************** //

export {
  // BASE CONSTANTS
  BASE_URL,
  POCKET_BASE_URL,
  AUTH_SESSION,
  USER_SESSION,
  WORKSPACE_SESSION,
  PAYMENT_SERVICE_TYPES,
  PAYMENT_SERVICE,
  DefaultCover,
  MTN_NO,
  AIRTEL_NO,
  ZAMTEL_NO,
  PASSWORD_PATTERN,
  placeHolderImage,
  TASK_ICON_BG_COLOR_MAP,
  TASK_TYPE,
  TRANSACTION_STATUS_COLOR_MAP,

  // ANIMATIONS
  staggerContainerItemVariants,
  staggerContainerVariants,

  // REACT QUERY KEYS
  USER_DATA_KEY,
  CONFIGS_QUERY_KEY,
  USER_ROLES_QUERY_KEY,
  USERS,
  SETUP_QUERY_KEY,
  WORKSPACES_QUERY_KEY,
  WORKSPACE_ROLES_QUERY_KEY,
  WORKSPACE_DASHBOARD_QUERY_KEY,
  WORKSPACE_MEMBERS_QUERY_KEY,
  DIRECT_BULK_TRANSACTIONS_QUERY_KEY,
  BATCH_DETAILS_QUERY_KEY,
  WALLET_HISTORY_QUERY_KEY,
}
