'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';

export default function StatusCodesTable({}) {
  return (
    <>
      <Table isStriped removeWrapper aria-label="API STATUS CODES TABLE">
        <TableHeader>
          <TableColumn width={'10%'}>CODE</TableColumn>
          <TableColumn width={'30%'}>TEXT</TableColumn>
          <TableColumn width={'60%'}>DESCRIPTION</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>500</TableCell>
            <TableCell>INTERNAL SERVER ERROR</TableCell>
            <TableCell>Something went wrong on the server</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>404</TableCell>
            <TableCell>NOT FOUND</TableCell>
            <TableCell>URL not found or is under maintenance</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>401</TableCell>
            <TableCell>UNAUTHORIZED</TableCell>
            <TableCell>Missing/Expired Authorization header</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>400</TableCell>
            <TableCell>BAD REQUEST</TableCell>
            <TableCell>
              Missing information/property in headers or payload
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>200</TableCell>
            <TableCell>OK</TableCell>
            <TableCell>Status OK</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
