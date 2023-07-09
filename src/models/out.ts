import { IUser,  IRoom } from "./iuser";
import { IPosition, IShip, AttackStatus } from "./common";

export interface IReg extends IUser {
  error: boolean;
  errorText: string;
};

export interface ICreateGameData {
  idGame: number,
  idPalayer: number,
}

export type IUpdateRoomData = IRoom[];

export interface IStartGameData {
  ships: IShip[],
  currentPlayerIndex: number
}

export interface IAttackData {
  position: IPosition;
  currentPlayer: ICurrPlayerData;
  status: AttackStatus
}

export interface ICurrPlayerData {
  currentPlayer: number;
}

export interface IFinishData {
  winPlayer: number;
}

