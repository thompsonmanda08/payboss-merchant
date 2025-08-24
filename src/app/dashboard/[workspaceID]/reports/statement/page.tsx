import StatementReport from './statement-report';
import { PageProps } from '@/types';

export default async function StatementReportPage({ params }: PageProps) {
  const workspaceID = (await params)?.workspaceID as string;
  return (
    <>
      <StatementReport workspaceID={workspaceID} />
    </>
  );
}
