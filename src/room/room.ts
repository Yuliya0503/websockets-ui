import { IRoom, IUser, IAuthenticatedWS } from '../models/iuser';
import Game from '../geme_control/game';
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
}
