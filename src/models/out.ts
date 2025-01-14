import { IUser, IRoom, IWinner } from './iuser';
import { IPosition, IShip, AttackStatus } from './common';

export interface IReg extends IUser {
  error: boolean;
  errorText: string;
}

export type UpdateWinnersData = IWinner[];

export interface ICreateGameData {
  idGame: number;
  idPlayer: number;
}

export type UpdateRoomData = IRoom[];

export interface IStartGameData {
  ships: IShip[];
  currentPlayerIndex: number;
}

export interface IAttackData {
  position: IPosition;
  currentPlayer: ICurrPlayerData;
  status: AttackStatus;
}

export interface ICurrPlayerData {
  currentPlayer: number;
}

export interface IFinishData {
  winPlayer: number;
}

export type OutData =
  | IReg
  | UpdateWinnersData
  | ICreateGameData
  | UpdateRoomData
  | IStartGameData
  | IAttackData
  | ICurrPlayerData
  | IFinishData;
