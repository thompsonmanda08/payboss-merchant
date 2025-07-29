import { JWTPayload } from "jose";
import { User } from "./account";
import React, { PropsWithChildren } from "react";

export type PageProps = {
  params?: Promise<any>;
  searchParams?: Promise<any>;
  children?: React.ReactNode;
};

export type APIResponse = {
  success: boolean;
  message: string;
  data: any;
  status?: number;
  [x: string]: unknown;
};

export type ErrorState = {
  status?: boolean;
  message?: string;
  [x: string]: any;
};

export type GenericJSONB = {
  id?: string;
  key: string;
  name: string;
};

export type Workspace = {
  ID?: string;
  workspace: string;
  workspace_type: string;
  [x: string]: any;
};

export type DocumentType = GenericJSONB & {
  key: string;
  name: string;
  file_types: string[];
  max_size_mb: number;
  description?: string;
  required?: boolean;
};

export type AuthSession = JWTPayload & {
  accessToken: string;
  refreshToken?: string;
  screenLocked?: boolean;
  [x: string]: any;
};

export type UserSession = {
  user: Partial<User> | null;
  merchantID: string;
  userPermissions: object[];
  kyc: any;
  [x: string]: unknown;
};

export type WorkspaceSession = {
  workspaceType: string | null;
  workspaces: any[];
  workspaceIDs: string[];
  activeWorkspace?: Workspace | null;
  workspacePermissions?: any;
  [x: string]: any;
};
