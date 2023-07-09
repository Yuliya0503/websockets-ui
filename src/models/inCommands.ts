import { IIdentification } from './common';
import { EInCommands } from './commands';
import {
  IRegData,
  IAddPlayerToRoomData,
  IAddShipsData,
  IAttackData,
  IRundomAttackData,
} from './in';

export interface IIncomingRegister extends IIdentification {
  type: EInCommands.REGISTER;
  data: IRegData;
}

export interface IIncomingCreateRoom extends IIdentification {
  type: EInCommands.CREATE_ROOM;
  data: '';
}

export interface IIncomingAddPlayerToRoom extends IIdentification {
  type: EInCommands.ADD_PLAYER_TO_ROOM;
  data: IAddPlayerToRoomData;
}

export interface IIcomingAddShips extends IIdentification {
  type: EInCommands.ADD_SHIPS;
  data: IAddShipsData;
}

export interface IIncomingAttack extends IIdentification {
  type: EInCommands.ATTACK;
  data: IAttackData;
}

export interface IIncomingRandomAttack extends IIdentification {
  type: EInCommands.RANDOM_ATTACK;
  data: IRundomAttackData;
}

export type IIncomingMessage =
  | IIncomingRegister
  | IIncomingCreateRoom
  | IIncomingAddPlayerToRoom
  | IIcomingAddShips
  | IIncomingAttack
  | IIncomingRandomAttack;
