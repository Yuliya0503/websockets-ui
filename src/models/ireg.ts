import { IUser } from "./iuser";

export interface IReg extends IUser {
  error: boolean;
  errorText: string;
}