import { IRoom, IUser, IAuthenticatedWS } from '../models/iuser';
import { ICreateGameData } from '../models/out';
import Game from '../geme_control/game';
import { buildOutMessage } from '../helpers/buildOutMess';
import { EOutCommands } from '../models/commands';

export default class Room implements IRoom {
  private static index = 0;
  public roomId: number;
  public roomUsers: IUser[] = [];
  public sockets: IAuthenticatedWS[] = [];
  public game: Game;

  constructor(ws: IAuthenticatedWS) {
    this.roomId = Room.index;
    this.roomUsers.push({ name: ws.name, index: ws.index });
    this.sockets.push(ws);
    Room.index++;
    return this;
  }

  gameCreate(): void {
    this.game = new Game();
    this.sockets.forEach(ws => {
      const details: ICreateGameData = { idGame:this.game.idGame, idPalayer: ws.index };
      const gameCreateResponse = JSON.stringify(buildOutMessage(EOutCommands.CREATE_GAME, details));
      console.log(`Responsed: ${gameCreateResponse}`);
      ws.send(gameCreateResponse);
    })
  }

}
