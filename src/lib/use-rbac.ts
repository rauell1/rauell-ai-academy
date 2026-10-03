import { useApi } from "./api";

export type RoleItem = {
  id: string;
  key: string;
  name: string;
};

export type RbacProfile = {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
  };
  roles: RoleItem[];
  permissions: string[];
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isInstructor: boolean;
  isEditor: boolean;
  isLearner: boolean;
};

export function useRbac() {
  return useApi<RbacProfile>("/auth/me");
}
