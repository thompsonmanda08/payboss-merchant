"use client";
import { useGeneralConfigOptions } from "./useQueryHooks";

const useConfigOptions = () => {
  const {
    data: response,
    isLoading,
    isError,
    isSuccess,
    isFetching,
  } = useGeneralConfigOptions();

  const banks = response?.data?.banks || [];
  const currencies = response?.data?.currencies || [];
  const companyTypes = response?.data?.company_types || [];
  const otherCountries = response?.data?.countries || [];

  const zambia = response?.data?.countries.find(
    (country) =>
      country.country_code === "ZM" ||
      country?.country.toLowerCase() === "zambia"
  );

  const countries = [zambia, ...otherCountries];
  const provinces = zambia?.provinces;

  return {
    banks,
    currencies,
    countries,
    provinces,
    companyTypes,
    isLoading,
    isError,
    isSuccess,
    isFetching,
  };
};

export default useConfigOptions;
