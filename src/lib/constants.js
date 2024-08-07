import IMG from '@/images/placeholder-image.webp'
import DefaultCover from '@/images/profile-cover.jpg'
import {
  ArrowRightCircleIcon,
  CircleStackIcon,
} from '@heroicons/react/24/outline'

const BASE_URL = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL
const POCKET_BASE_URL =
  process.env.POCKET_BASE_URL || process.env.NEXT_PUBLIC_POCKET_BASE_URL

const AUTH_SESSION = 'pb-session'
const USER_SESSION = 'pb-next-usr'
const WORKSPACE_SESSION = 'pb-next-workspace'

const placeHolderImage = IMG

// QUERY KEYS
const USER_DATA_KEY = 'user-query-data'
const CONFIGS_QUERY_KEY = 'configs-query-data'
const USER_ROLES_QUERY_KEY = 'user-roles-query-data'
const SETUP_QUERY_KEY = 'setup-query-data'
const WORKSPACES_QUERY_KEY = 'workspaces-query-data'

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
const MTN_NO = /^(?:\+?26|26)?(096|076)\d{7}$/
const AIRTEL_NO = /^(?:\+?26|26)?(097|077)\d{7}$/
const ZAMTEL_NO = /^(?:\+?26|26)?(095|075)\d{7}$/
const PASSWORD_PATTERN = /"(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/

const PAYMENT_SERVICE_TYPES = [
  {
    name: 'Bulk Payment',
    Icon: CircleStackIcon,
    href: '/dashboard/payments/create/bulk',
    index: 0,
  },
  {
    name: 'Single Payment',
    Icon: ArrowRightCircleIcon,
    href: '/dashboard/payments/create/single',
    index: 1,
  },
]

// ***************** EXPORTS ******************** //

export {
  // BASE CONSTANTS
  BASE_URL,
  POCKET_BASE_URL,
  AUTH_SESSION,
  USER_SESSION,
  WORKSPACE_SESSION,
  PAYMENT_SERVICE_TYPES,
  WORKSPACES_QUERY_KEY,

  //
  DefaultCover,
  MTN_NO,
  AIRTEL_NO,
  ZAMTEL_NO,
  PASSWORD_PATTERN,
  placeHolderImage,

  // ANIMATIONS
  staggerContainerItemVariants,
  staggerContainerVariants,

  // REACT QUERY KEYS
  USER_DATA_KEY,
  CONFIGS_QUERY_KEY,
  USER_ROLES_QUERY_KEY,
  SETUP_QUERY_KEY,
}
