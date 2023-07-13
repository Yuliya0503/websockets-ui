import { IRoom, IUser, IAuthenticatedWS } from '../models/iuser';
import { ICreateGameData, IStartGameData } from '../models/out';
import Game from '../geme_control/game';
import { buildOutMessage } from '../helpers/buildOutMess';
import { EOutCommands } from '../models/commands';
import { AttackStatus, IPosition, IShip } from 'src/models/common';

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

  gameCreate(): void {
    this.game = new Game();
    this.sockets.forEach((ws) => {
      const details: ICreateGameData = {
        idGame: this.game.idGame,
        idPalayer: ws.index,
      };
      const gameCreateResponse = JSON.stringify(buildOutMessage(EOutCommands.CREATE_GAME, details));
      console.log(`Responsed: ${gameCreateResponse}`);
      ws.send(gameCreateResponse);
    });
  }

  setPlayerShips(playerId: number, ships: IShip[]) {
    if (this.game.ships.size === 0) {
      this.game.setCurrPlayer(playerId);
    }
    this.game.ships.set(playerId, ships);
    if (this.game.ships.size === 2) {
      this.game.startGame();
      const currentPlayerIndex = this.game.getCurrPlayer();
      this.sockets.forEach((ws: IAuthenticatedWS) => {
        const details: IStartGameData = {
          currentPlayerIndex,
          ships: this.game.ships.get(ws.index) as IShip[],
        };
        const startGameResp = JSON.stringify(buildOutMessage(EOutCommands.START_GAME, details));
        console.log(`Response: ${startGameResp}`);
        ws.send(startGameResp);
      });
    }
  }

  getOppositePlayer(playerId: number): number {
    const oppositePlayer = this.roomUsers.find(({ index }) => {
      return index !== playerId;
    });
    return oppositePlayer?.index as number;
  }

  attackHandler(playerId: number, position: IPosition | null) {
    const oppositePlayerId = this.game.getCurrPlayer();
    const oppositId = this.getOppositePlayer(playerId);
    const attack = this.game.attackHandle(playerId, oppositId, position);
    this.attackProcess = true;
    this.endOfGame = this.game.endOfGameCheck(oppositePlayerId);
    this.sockets.forEach((ws: IAuthenticatedWS): void => {
      const attackResponse = JSON.stringify(buildOutMessage(EOutCommands.ATTACK, attack));
      console.log(`Response: ${attackResponse}`);
      ws.send(attackResponse);
      if (this.endOfGame) {
        const endOfGameResponse = JSON.stringify(
          buildOutMessage(EOutCommands.FINISH, { winPlayer: playerId }),
        );
        console.log(`Response: ${endOfGameResponse}`);
        ws.send(endOfGameResponse);
      }
      if (attack.status === AttackStatus.Miss) {
        this.game.setCurrPlayer(oppositId);
        const turnResponse = JSON.stringify(
          buildOutMessage(EOutCommands.TURN, { currentPlayer: oppositId }),
        );
        console.log(`Response: ${turnResponse}`);
        ws.send(turnResponse);
      }
    });
    if (this.endOfGame || this.attackProcess) {
      console.log('End of game or other attack in process');
      return false;
    }
    if (oppositePlayerId !== playerId) {
      console.log('Not players turn');
      return false;
    }
    this.attackProcess = false;
    return this.endOfGame;
  }
}
