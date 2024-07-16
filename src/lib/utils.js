import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import toast from 'react-hot-toast'
import axios from 'axios'
import { AIRTEL_NO, BASE_URL, MTN_NO, ZAMTEL_NO } from './constants'

export const apiClient = axios.create({
  baseURL: BASE_URL,
})

export const authenticatedClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const notify = (type, message) => toast[type](message)

export function formatCurrency(amount) {
  const currencyFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  })
  return amount ? currencyFormat.format(amount) : ''
}

export function formatDate(inputDate) {
  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }

  const formattedDate = new Date(inputDate).toLocaleDateString('en', options)

  const [month, day, year] = formattedDate.split(' ')

  return `${parseInt(day)}-${month}-${year}`
}

export function maskString(string, firstCharacters = 0, lastCharacters = 6) {
  if (string?.length < 10) {
    return string
  }

  const first = string?.slice(0, firstCharacters)
  const last = string?.slice(string.length - lastCharacters)
  return `${first} *****${last}`
}

export function getUserInitials(name) {
  return name
    ?.split(' ')
    .map((i) => i[0])
    .join('')
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function isValidZambianMobileNumber(mobileNumber) {
  if (mobileNumber?.replaceAll(/\D/g, '').toString()?.length < 10) {
    return false
  }

  if (
    MTN_NO.test(mobileNumber) ||
    AIRTEL_NO.test(mobileNumber) ||
    ZAMTEL_NO.test(mobileNumber)
  )
    return true // Valid Zambian mobile number

  return false // INvalid Zambian mobile number
}

export function getFormattedZambianMobileNumber(mobileNumber) {
  if (!isValidZambianMobileNumber(mobileNumber)) {
    return {
      provider: null,
      mobileNumber: 'Invalid Number',
    } // Invalid Zambian mobile number
  }

  let provider = null
  if (MTN_NO.test(mobileNumber)) {
    provider = 'MTN '
  } else if (AIRTEL_NO.test(mobileNumber)) {
    provider = 'Airtel '
  } else if (ZAMTEL_NO.test(mobileNumber)) {
    provider = 'Zamtel'
  }
  return {
    provider,
    mobileNumber: mobileNumber.replace('+', ''),
  }
}

export function isValidNRCNo(input) {
  // REMOVE ALL NON-DIGITS
  const formattedID = input.trim().replaceAll(/\D/g, '')

  if (
    formattedID.charAt(formattedID.length - 1) === '1' &&
    formattedID.length === 9
  ) {
    return true
  }

  notify('error', 'Enter a Valid NRC Number')

  return false
}
