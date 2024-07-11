import IMG from '@/images/placeholder-image.webp'

const COOKIE_ME = 'next-auth-Token'

export { COOKIE_ME }

export const placeHolderImage = IMG
// QUERY KEYS
export const USER_DATA_KEY = 'user-data'

// ANIMATION_VARIANTS
export const staggerContainerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
    },
  },
  exit: { opacity: 0 },
}

export const staggerContainerItemVariants = {
  hidden: { opacity: 0, y: -60 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 60 },
}

// REGEX
export const MTN_NO =
  /^(?:(?:\+?26|0?26)?096|\d{5})(\d{7})|(?:(?:\+?26|0?26)?076|\d{5})(\d{7})$/

export const AIRTEL_NO =
  /^(?:(?:\+?26|0?26)?097|\d{5})(\d{7})|(?:(?:\+?26|0?26)?077|\d{5})(\d{7})$/

export const ZAMTEL_NO =
  /^(?:(?:\+?26|0?26)?095|\d{5})(\d{7})|(?:(?:\+?26|0?26)?075|\d{5})(\d{7})$/
