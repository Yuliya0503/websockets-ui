import { EOutCommands } from './commands';
import {
  IReg,
  UpdateWinnersData,
  ICreateGameData,
  UpdateRoomData,
  IStartGameData,
  IAttackData,
  ICurrPlayerData,
  IFinishData,
} from './out';
import { IIdentification } from './common';

export interface IOutReg extends IIdentification {
  type: EOutCommands.REGISTER;
  data: IReg;
}

export interface IOutUpdateWinners extends IIdentification {
  type: EOutCommands.UPDATE_WINNERS;
  data: UpdateWinnersData;
}

export interface IOutCreateGame extends IIdentification {
  type: EOutCommands.CREATE_GAME;
  data: ICreateGameData;
}

export interface IOutUpdateRoom extends IIdentification {
  type: EOutCommands.UPDATE_ROOM;
  data: UpdateRoomData;
}

export interface IOutStartGame extends IIdentification {
  type: EOutCommands.START_GAME;
  data: IStartGameData;
}

export interface IOutAttack extends IIdentification {
  type: EOutCommands.ATTACK;
  data: IAttackData;
}

export interface IOutTurn extends IIdentification {
  type: EOutCommands.TURN;
  data: ICurrPlayerData;
}

export interface IOutFinish extends IIdentification {
  type: EOutCommands.FINISH;
  data: IFinishData;
}

export type IOutgoingMessage =
  | IOutReg
  | IOutUpdateWinners
  | IOutCreateGame
  | IOutUpdateRoom
  | IOutStartGame
  | IOutAttack
  | IOutTurn
  | IOutFinish;
