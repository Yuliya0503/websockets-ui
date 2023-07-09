import { IShip } from "./common";

export interface IRegData {
  name: string;
  password: string;
}

export interface IAddPlayerToRoomData {
  indexRoom: number;
}

export interface IAddShipsData {
  gameId: number;
  ships: IShip[];
  indexPlayer: number;
}

export interface IAttackData {
  gameID: number;
  x: number;
  y: number;
  indexPlayer: number;
}

export interface IRundomAttackData {
  gameID: number;
  indexPlayer: number;
}
