'use client';
import { useState } from "react";
import { Card } from "@/components/base";
import SummaryTable from "./SummaryTable";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from '@radix-ui/react-icons';
import ConfirmationModal from "@/components/base/ConfirmationModal";



const columns = [
    { header: 'First Name', accessor: 'fname' },
    { header: 'Last Name', accessor: 'lname' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone #', accessor: 'phone' },
    { header: 'NRC', accessor: 'nrc' },
    { header: 'Account Type', accessor: 'account' },
    { header: 'Account #', accessor: 'accountno' },
    { header: 'Amount', accessor: 'amount' },
    { header: 'Bank Code', accessor: 'bankc' },
    { header: 'Currency', accessor: 'currency' },
    { header: 'Reason', accessor: 'reason' },
  ];
  const people = [
    {
        fname: 'Mwansa',
        lname: 'Mwila',
        nrc: '120089/10/1',
        phone: '+260 770 000 000',
        email: 'mwansa.mwila@example.com',
        account: 'Bank',
        accountno: '000 000 000 121 1',
        bankc: 'zanaco_zm',
        currency: 'ZMW',
        amount: '20,000',
        reason:"account error"
      },
      {
        fname: 'Chisomo',
        lname: 'Banda',
        nrc: '200344/34/2',
        phone: '+260 770 111 111',
        email: 'chisomo.banda@example.com',
        account: 'Mobile',
        accountno: '+260 770 111 111',
        bankc: 'mtn_zm',
        currency: 'ZMW',
        amount: '5,000',
        reason:"account error"
      },
      {
        fname: 'Misozi',
        lname: 'Zulu',
        nrc: '310056/12/3',
        phone: '+260 770 222 222',
        email: 'misozi.zulu@example.com',
        account: 'Bank',
        accountno: '000 000 000 345 6',
        bankc: 'stanbic_zm',
        currency: 'ZMW',
        amount: '10,000',
        reason:"account error"
      },
      {
        fname: 'Kunda',
        lname: 'Phiri',
        nrc: '400789/09/4',
        phone: '+260 770 333 333',
        email: 'kunda.phiri@example.com',
        account: 'Mobile',
        accountno: '+260 770 333 333',
        bankc: 'airtel_zm',
        currency: 'ZMW',
        amount: '15,000',
        reason:"account error"
      },
      {
        fname: 'Chanda',
        lname: 'Mulenga',
        nrc: '550123/07/5',
        phone: '+260 770 444 444',
        email: 'chanda.mulenga@example.com',
        account: 'Bank',
        accountno: '000 000 000 567 8',
        bankc: 'barclays_zm',
        currency: 'ZMW',
        amount: '25,000',
        reason:"account error"
      },
      {
        fname: 'Mwaka',
        lname: 'Tembo',
        nrc: '670098/08/6',
        phone: '+260 750 555 555',
        email: 'mwaka.tembo@example.com',
        account: 'Mobile',
        accountno: '+260 750 555 555',
        bankc: 'zamtel_zm',
        currency: 'ZMW',
        amount: '30,000',
        reason:"account error"
      },
  ];
export default function InvalidRecords () {
    const [openDelete, setOpenDeleteList] = useState(false);
      const closeDeleteModal = () => {
        setOpenDeleteList(false);
      };
      const openDeleteModal = () => {
        setOpenDeleteList(true);
      };
      const renderActions = (person) => (
        <div className="flex items-center justify-between">
            <PencilSquareIcon
          className="h-5 w-5 cursor-pointer text-primary hover:text-primary/50"
        />
        <TrashIcon onClick={openDeleteModal} className="h-5 w-5 cursor-pointer text-red-500 hover:text-red-300" />
        </div>
      );

    return (
      <>
        <SummaryTable columns={columns} data={people} actions={renderActions} />
        <ConfirmationModal
          show={openDelete}
          setShow={closeDeleteModal}
          title="Delete Entry"
          content="Are you sure you want to delete this entry from batch?"
          onConfirm={() => {
            closeDeleteModal()
          }}
        />
      </>
    )
}