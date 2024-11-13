// import React from 'react'
// import {
//   Table,
//   TableHeader,
//   TableColumn,
//   TableBody,
//   TableRow,
//   TableCell,
//   Chip,
// } from '@nextui-org/react'

// const statusColorMap = {
//   submitted: 'primary',
//   review: 'secondary',
//   complete: 'success',
//   approved: 'success',
//   pending: 'warning',
//   aborted: 'danger',
//   rejected: 'danger',
// }

// const columns = [
//   { name: 'BATCH NAME', uid: 'batch-name' },
//   { name: 'TYPE', uid: 'type' },
//   { name: 'DATE CREATED', uid: 'date-created' },
//   { name: 'QUANTITY', uid: 'quantity' },
//   { name: 'TOTAL AMOUNT', uid: 'total-amount' },
//   { name: 'STATUS', uid: 'status' },
// ]

// export default function BatchListTable({ items }) {
//   const renderCell = React.useCallback((item, columnKey) => {
//     const cellValue = item[columnKey]

//     switch (columnKey) {
//       case 'status':
//         return (
//           <Chip
//             className="capitalize"
//             color={statusColorMap[item.status]}
//             size="sm"
//             variant="flat"
//           >
//             {cellValue}
//           </Chip>
//         )

//       default:
//         return cellValue
//     }
//   }, [])

//   return (
//     <Table
//       aria-label="Example table with custom cells"
//       className="max-h-[600px]"
//       isStriped
//       isHeaderSticky
//     >
//       <TableHeader columns={columns} className="fixed">
//         {(column) => (
//           <TableColumn
//             key={column.uid}
//             align={column.uid === 'actions' ? 'center' : 'start'}
//           >
//             {column.name}
//           </TableColumn>
//         )}
//       </TableHeader>
//       <TableBody items={items}>
//         {(item) => (
//           <TableRow key={item.id}>
//             {(columnKey) => (
//               <TableCell>{renderCell(item, columnKey)}</TableCell>
//             )}
//           </TableRow>
//         )}
//       </TableBody>
//     </Table>
//   )
// }
