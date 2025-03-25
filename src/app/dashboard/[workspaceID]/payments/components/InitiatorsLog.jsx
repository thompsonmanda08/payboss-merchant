"use client";
import React from "react";
import Wallet from "../../workspace-settings/components/wallet";
import useWorkspaces from "@/hooks/useWorkspaces";

const InitiatorsLog = ({}) => {
  const { activeWorkspace, workspaceID } = useWorkspaces();
  return (
    <div className="min-w-md flex flex-1 flex-grow flex-col gap-4">
      <Wallet
        workspaceName={activeWorkspace?.workspace}
        workspaceID={workspaceID}
        hideHistory
      />
    </div>
  );
};

export default InitiatorsLog;
