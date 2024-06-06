import { Card } from '@/components/base'
import SummaryTable from './SummaryTable'

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
]
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
  },
]
export default function ValidRecords() {
  return (
    <Card>
      <SummaryTable columns={columns} data={people} />
    </Card>
  )
}
