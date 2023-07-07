import { WebSocket } from "ws";
export interface IUser {
  name: string;
  index: number;
}

export interface IAuthenticatedWS extends IUser, WebSocket {};