import IMG from '@/images/placeholder-image.webp'
import DefaultCover from '@/images/profile-cover.jpg'

const BASE_URL = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL
const POCKET_BASE_URL =
  process.env.POCKET_BASE_URL || process.env.NEXT_PUBLIC_POCKET_BASE_URL

const AUTH_SESSION = 'pb-session'

const placeHolderImage = IMG

// QUERY KEYS
const USER_DATA_KEY = 'user-query-data'
const CONFIGS_QUERY_KEY = 'configs-query-data'
const USER_ROLES_QUERY_KEY = 'user-roles-query-data'

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

// ***************** EXPORTS ******************** //

export {
  // BASE CONSTANTS
  BASE_URL,
  POCKET_BASE_URL,
  AUTH_SESSION,

  //
  DefaultCover,
  MTN_NO,
  AIRTEL_NO,
  ZAMTEL_NO,
  placeHolderImage,

  // ANIMATIONS
  staggerContainerItemVariants,
  staggerContainerVariants,

  // REACT QUERY KEYS
  USER_DATA_KEY,
  CONFIGS_QUERY_KEY,
  USER_ROLES_QUERY_KEY,
}
