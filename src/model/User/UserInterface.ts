import { USER_ROLES } from "./User";

export interface TokenPayload {
  id: string;
  name: string;
  role: USER_ROLES;
}

export interface UserDB {
  id: string;
  name: string;
  email: string;
  password: string;
  role: USER_ROLES;
  created_at: string;
}