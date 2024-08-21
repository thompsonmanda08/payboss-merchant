import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import toast from 'react-hot-toast'
import axios from 'axios'
import { parseDate, getLocalTimeZone } from '@internationalized/date'
import { AIRTEL_NO, BASE_URL, MTN_NO, ZAMTEL_NO } from './constants'

export const apiClient = axios.create({
  baseURL: BASE_URL,
})

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const notify = (type, message) => toast[type](message)

export function formatCurrency(amount) {
  const currencyFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'Z<W',
    minimumFractionDigits: 2,
  })
  return amount ? currencyFormat.format(amount) : ''
}

export const formatActivityData = (activityLog) => {
  const groupedData = {}

  activityLog.forEach((activity) => {
    activity.data.forEach((item) => {
      const createdAt = new Date(item.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      if (!groupedData[createdAt]) {
        groupedData[createdAt] = []
      }

      groupedData[createdAt].push(item)
    })
  })

  const result = Object.keys(groupedData).map((date) => ({
    title: date,
    data: groupedData[date],
  }))

  return result
}

export function formatDate(inputDate, dateStyle = '') {
  if (dateStyle === 'YYYY-MM-DD') {
    const date = new Date(inputDate)

    // Get the year, month, and day components
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-indexed, pad single digits with a leading zero
    const day = String(date.getDate()).padStart(2, '0') // Pad single digits with a leading zero

    // Format the date as "YYYY-MM-DD"
    return `${year}-${month}-${day}`
  }

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
  let number = mobileNumber?.replaceAll(/\D/g, '').toString()
  if (number?.length < 10 || number?.length > 12) {
    return false
  }

  if (MTN_NO.test(number) || AIRTEL_NO.test(number) || ZAMTEL_NO.test(number))
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
