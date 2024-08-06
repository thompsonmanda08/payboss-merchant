'use client'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { useSetupConfig } from './useQueryHooks'

const useAccountProfile = () => {
  const { data: setup } = useSetupConfig()
  const user = setup?.data?.userDetails || []
  const roles = setup?.data?.userDetails?.roles || []

  return { user, roles }
}

export default useAccountProfile
