// 'use client'
// import { useEffect, useState } from 'react'
// import useCustomTabsHook from '@/hooks/useCustomTabsHook'
// import usePaymentsStore from '@/context/paymentsStore'
// import { redirect, useSearchParams } from 'next/navigation'
// import ApproverAction from '@/components/disbursements/ApproverAction'
// import { PAYMENT_SERVICE_TYPES } from '@/lib/constants'
// import SinglePaymentDetails from '@/components/disbursements/SinglePaymentDetails'
// import Card from '@/components/base/Card'
// import CardHeader from '@/components/base/CardHeader'
// import ProgressStep from '@/components/elements/ProgressStep'
// import InitiatorsLog from '@/components/disbursements/InitiatorsLog'
// import { MissingConfigurationError } from '@/components/base/ErrorCard'

// export const STEPS = [
//   {
//     title: 'Create a Single payment',
//     infoText: 'Provide recipient details for the payment action ',
//     step: 'Recipient Details',
//   },

//   {
//     title: 'Create a payment - Approval Status',
//     infoText: 'Approvals can only be done by account admins',
//     step: 'Approval',
//   },
// ]

// function SinglePaymentAction({ workspaceID }) {
//   // ** INITIALIZES STEPS **//
//   const [currentStep, setCurrentStep] = useState(STEPS[0])
//   const urlParams = useSearchParams()
//   const protocol = urlParams.get('protocol')

//   const { workspaceUserRole: role } = useDashboard()
//   const { dashboardRoute, router } = useNavigation()

//   // ** INITIALIZEs PAYMENT STATE **//
//   const { selectedProtocol, setSelectedProtocol, setSelectedActionType } =
//     usePaymentsStore()

//   //************ STEPS TO CREATE A TASK FOR A STUDY PLAN *****************/
//   const {
//     activeTab,
//     currentTabIndex,
//     navigateTo,
//     navigateForward,
//     navigateBackwards,
//   } = useCustomTabsHook([
//     <SinglePaymentDetails
//       key={'form-details'}
//       navigateForward={goForward}
//       navigateBackwards={goBack}
//     />,
//     <ApproverAction
//       key={'step-5'}
//       // navigateForward={goForward}
//       // navigateBackwards={goBack}
//     />,
//   ])

//   function goForward() {
//     navigateForward()
//   }

//   function goBack() {
//     navigateBackwards()
//   }

//   useEffect(() => {
//     setCurrentStep(STEPS[currentTabIndex])
//     setSelectedActionType(PAYMENT_SERVICE_TYPES[1])

//     //TODO: => CLEAR DATA WHEN THE THE COMPONENT IS UNMOUNTED
//     // return () => {
//     //   resetPaymentData()
//     // }
//   }, [currentTabIndex])

//   useEffect(() => {
//     if (protocol) {
//       setSelectedProtocol(protocol)
//     }
//   }, [protocol])

//   //**************** USER ROLE CHECK *************************************** //
//   // if (!role?.can_initiate) return router.back()

//   // *************** CHECK FOR SERVICE PROTOCOL - REQUIRED *************** //
//   if (!selectedProtocol) return <MissingConfigurationError />

//   return (
//     <>
//       {/************************* COMPONENT RENDERER *************************/}

//       <Card className={'max-w-[1200px] flex-[2] rounded-2xl'}>
//         <CardHeader
//           title={
//             <>
//               {currentStep.title}
//               {
//                 selectedProtocol && (
//                   <span className="capitalize"> ({selectedProtocol})</span>
//                 ) //ONLY FOR THE CREATE PAYMENTS PAGE
//               }
//             </>
//           }
//           infoText={currentStep.infoText}
//           handleClose={() => router.back()}
//         />
//         <ProgressStep STEPS={STEPS} currentTabIndex={currentTabIndex} />
//         {activeTab}
//       </Card>
//       <InitiatorsLog />
//     </>
//   )
// }

// export default SinglePaymentAction
