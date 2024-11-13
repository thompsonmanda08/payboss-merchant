'use client'
import { useGeneralConfigOptions } from './useQueryHooks'

const useConfigOptions = () => {
  const {
    data: response,
    isLoading,
    isError,
    isSuccess,
    isFetching,
  } = useGeneralConfigOptions()

  const banks = response?.data?.banks
  const currencies = response?.data?.currencies
  const provinces = response?.data?.provinces
  const companyTypes = response?.data?.companyTypes

  return {
    banks,
    currencies,
    provinces,
    companyTypes,
    isLoading,
    isError,
    isSuccess,
    isFetching,
  }
}

export default useConfigOptions
