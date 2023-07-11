import UserServices from '../user/userServices';
import { WebSocket } from 'ws';
import { parseRawIncommingMessage } from '../helpers/parseRawIncMess';
import { EInCommands, EOutCommands } from '../models/commands';
import { buildOutMessage } from '../helpers/buildOutMess';
import RoomService from '../room/roomSrvice';
import { IAuthenticatedWS } from 'src/models/iuser';

export default class GameController {
  private userServises = new UserServices();
  private translate: (mess: string) => void;
  private roomService = new RoomService();

  constructor(translate: (mess: string) => void) {
    this.translate = translate;
  }

  public incommMess(ws: WebSocket, mess: string) {
    console.log(`Received this message: "${mess}"`);
    const message = parseRawIncommingMessage(mess);
    if (message === null) {
      return null;
    } else if (message.type === EInCommands.REGISTER) {
      const {
        data: { name, password },
      } = message;
      const registration = this.userServises.register(name, password, ws);
      const registrationResponse = JSON.stringify(
        buildOutMessage(EOutCommands.REGISTER, registration),
      );
      console.log(`Responsed personal: ${registrationResponse}`);
      ws.send(registrationResponse);

      const winners = this.userServises.getWinners();
      const winnersResponse = JSON.stringify(buildOutMessage(EOutCommands.UPDATE_WINNERS, winners));
      console.log(`Responsed winners: ${winnersResponse}`);
      this.translate(winnersResponse);

      const rooms = this.roomService.getRooms();
      const roomResponse = JSON.stringify(buildOutMessage(EOutCommands.UPDATE_ROOM, rooms));
      console.log(`Responsed personal: ${roomResponse}`);
      ws.send(roomResponse);
    } else if (message.type === EInCommands.CREATE_ROOM) {
      const room = this.roomService.createRoom(ws as IAuthenticatedWS);
      if (room) {
        const rooms = this.roomService.getRooms();
        const roomResponse = JSON.stringify(buildOutMessage(EOutCommands.UPDATE_ROOM, rooms));
        console.log(`Translate: ${roomResponse}`);
        this.translate(roomResponse);
      }
    } else if (message.type === EInCommands.ADD_PLAYER_TO_ROOM) {
      const {
        data: { indexRoom },
      } = message;
      this.roomService.addPlayerToRoom(ws as IAuthenticatedWS, indexRoom);
      const rooms = this.roomService.getRooms();
      const roomResponse = JSON.stringify(buildOutMessage(EOutCommands.UPDATE_ROOM, rooms));
      console.log(`Translate: ${roomResponse}`);
      this.translate(roomResponse);
    } else if (message.type === EInCommands.ADD_SHIPS) {
      const {
        data: { gameId, indexPlayer, ships },
      } = message;
      this.roomService.addShips(gameId, indexPlayer, ships);
    }
  }
}
