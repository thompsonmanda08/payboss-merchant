import React from 'react';

import CollectionsReports from './collection-reports';
import { PageProps } from '@/types';

export default async function CollectionsReportsPage({ params }: PageProps) {
  const workspaceID = (await params)?.workspaceID as string;
  return (
    <>
      <CollectionsReports workspaceID={workspaceID} />
    </>
  );
}
