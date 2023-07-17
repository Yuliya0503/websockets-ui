import { IRoom, IUser, IAuthenticatedWS } from '../models/iuser';
import { ICreateGameData, IStartGameData } from '../models/out';
import Game from '../geme_control/game';
import { buildOutMessage } from '../helpers/buildOutMess';
import { EOutCommands } from '../models/commands';
import { AttackStatus, IPosition, IShip } from '../models/common';

interface IAttack {
  currentPlayer: number;
  status: AttackStatus;
  position: IPosition;
}

export default class Room implements IRoom {
  private static index = 0;
  public roomId: number;
  public roomUsers: IUser[] = [];
  public sockets: IAuthenticatedWS[] = [];
  public game: Game;
  public attackProcess = false;
  public endOfGame = false;

  constructor(ws: IAuthenticatedWS) {
    this.roomId = Room.index;
    this.roomUsers.push({ name: ws.name, index: ws.index });
    this.sockets.push(ws);
    Room.index++;
    return this;
  }

  public gameCreate(): void {
    this.game = new Game();
    this.sockets.forEach((ws): void => {
      const details: ICreateGameData = {
        idGame: this.game.idGame,
        idPlayer: ws.index,
      };

      const gameCreateResponse: string = JSON.stringify(
        buildOutMessage(EOutCommands.CREATE_GAME, details),
      );
      console.log(`Responsed: ${gameCreateResponse}`);
      ws.send(gameCreateResponse);
    });
  }

  public setPlayerShips(playerId: number, ships: IShip[]): void {
    if (this.game.ships.size === 0) {
      this.game.setCurrPlayer(playerId);
    }

    this.game.ships.set(playerId, ships);
    if (this.game.ships.size === 2) {
      this.game.startGame();
      const currentPlayerIndex: number = this.game.getCurrPlayer();
      this.sockets.forEach((ws: IAuthenticatedWS): void => {
        const details: IStartGameData = {
          currentPlayerIndex,
          ships: this.game.ships.get(ws.index) as IShip[],
        };
        const startGameResp: string = JSON.stringify(
          buildOutMessage(EOutCommands.START_GAME, details),
        );
        console.log(`Response: ${startGameResp}`);
        ws.send(startGameResp);
      });
    }
  }

  private getOppositePlayer(playerId: number): number {
    const oppositePlayer: IUser | undefined = this.roomUsers.find(({ index }) => {
      return index !== playerId;
    });
    return oppositePlayer?.index as number;
  }

  public attackHandler(playerId: number, position: IPosition | null): boolean {
    if (this.endOfGame || this.attackProcess) {
      console.log('End of game or other attack in process');
      return false;
    }
    const oppositePlayerId: number = this.game.getCurrPlayer();
    if (oppositePlayerId !== playerId) {
      console.log('Not players turn');
      return false;
    }
    const oppositId: number = this.getOppositePlayer(playerId);
    const attack: IAttack = this.game.attackHandle(playerId, oppositId, position);
    this.attackProcess = true;
    this.endOfGame = this.game.endOfGameCheck(oppositId);

    this.sockets.forEach((ws: IAuthenticatedWS): void => {
      const attackResponse: string = JSON.stringify(buildOutMessage(EOutCommands.ATTACK, attack));
      console.log(`Response: ${attackResponse}`);
      ws.send(attackResponse);
      if (this.endOfGame) {
        const endOfGameResponse: string = JSON.stringify(
          buildOutMessage(EOutCommands.FINISH, { winPlayer: playerId }),
        );
        console.log(`Response: ${endOfGameResponse}`);
        ws.send(endOfGameResponse);
      }
      if (attack.status === AttackStatus.Miss) {
        this.game.setCurrPlayer(oppositId);
        const turnResponse: string = JSON.stringify(
          buildOutMessage(EOutCommands.TURN, { currentPlayer: oppositId }),
        );
        console.log(`Response: ${turnResponse}`);
        ws.send(turnResponse);
      }
    });
    this.attackProcess = false;
    return this.endOfGame;
  }
}
