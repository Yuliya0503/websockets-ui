import { WebSocket } from 'ws';
export interface IUser {
  name: string;
  index: number;
}

export interface IAuthenticatedWS extends IUser, WebSocket {}

export interface IWinner {
  name: string;
  wins: number;
}

export interface IRoom {
  roomId: number;
  roomUsers: IUser[];
}
