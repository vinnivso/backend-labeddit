import { TokenPayload, UserDB } from "./UserInterface";

export enum USER_ROLES {
  ADMIN = "ADMIN",
  NORMAL = "NORMAL",
}

export class User {
  constructor(
    private id: string,
    private name: string,
    private email: string,
    private password: string,
    private role: USER_ROLES,
    private createdAt: string
  ) { }
  public get ID(): string {
    return this.id;
  }

  public get NAME(): string {
    return this.name;
  }

  public get EMAIL(): string {
    return this.email;
  }

  public get PASSWORD(): string {
    return this.password;
  }

  public get ROLE(): USER_ROLES {
    return this.role;
  }

  public get CREATEDAT(): string {
    return this.createdAt;
  }

  public set ID(newId: string) {
    this.id = newId;
  }

  public set NAME(newName: string) {
    this.name = newName;
  }

  public set EMAIL(newEmail: string) {
    this.email = newEmail;
  }

  public set PASSWORD(newPassword: string) {
    this.password = newPassword;
  }

  public set ROLE(newRole: USER_ROLES) {
    this.role = newRole;
  }

  public set CREATEDAT(newCreatedAt: string) {
    this.createdAt = newCreatedAt;
  }

  public toDBModel(): UserDB {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
      created_at: this.createdAt,
    };
  }

  public toUserPayloadModel(): TokenPayload {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
    };
  }
}