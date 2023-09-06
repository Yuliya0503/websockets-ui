import { WebSocket } from 'ws';

import UserServices from '../user/userServices';
import { parseRawIncommingMessage } from '../helpers/parseRawIncMess';
import { EInCommands, EOutCommands } from '../models/commands';
import { buildOutMessage } from '../helpers/buildOutMess';
import RoomService from '../room/roomSrvice';
import { IAuthenticatedWS, IWinner } from '../models/iuser';
import { IPosition } from '../models/common';
import { IIncomingMessage } from '../models/inCommands';
import { IReg } from '../models/out';
import Room from '../room/room';

export default class GameController {
  private userServices = new UserServices();
  private roomService = new RoomService();
  public translate: (mess: string) => void;

  constructor(translate: (mess: string) => void) {
    this.translate = translate;
  }

  public incommMess(ws: WebSocket, mess: string) {
    console.log(`Received this message: "${mess}"`);
    const message: IIncomingMessage | null = parseRawIncommingMessage(mess);

    if (message === null) {
      return null;
    } else if (message.type === EInCommands.REGISTER) {
      const {
        data: { name, password },
      } = message;

      const registration: IReg = this.userServices.register(name, password, ws);
      const registrationResponse: string = JSON.stringify(
        buildOutMessage(EOutCommands.REGISTER, registration),
      );
      console.log(`Responsed personal: ${registrationResponse}`);
      ws.send(registrationResponse);

      const winners: IWinner[] = this.userServices.getWinners();
      const winnersResponse: string = JSON.stringify(
        buildOutMessage(EOutCommands.UPDATE_WINNERS, winners),
      );
      console.log(`Responsed winners: ${winnersResponse}`);
      this.translate(winnersResponse);

      const rooms = this.roomService.getRooms();
      const roomResponse: string = JSON.stringify(buildOutMessage(EOutCommands.UPDATE_ROOM, rooms));
      console.log(`Responsed personal: ${roomResponse}`);
      ws.send(roomResponse);
    } else if (message.type === EInCommands.CREATE_ROOM) {
      const room: Room | null = this.roomService.createRoom(ws as IAuthenticatedWS);
      if (room) {
        const rooms = this.roomService.getRooms();
        const roomResponse: string = JSON.stringify(
          buildOutMessage(EOutCommands.UPDATE_ROOM, rooms),
        );
        console.log(`Translate: ${roomResponse}`);
        this.translate(roomResponse);
      }
    } else if (message.type === EInCommands.ADD_PLAYER_TO_ROOM) {
      const {
        data: { indexRoom },
      } = message;
      this.roomService.addPlayerToRoom(ws as IAuthenticatedWS, indexRoom);
      const rooms = this.roomService.getRooms();
      const roomResponse: string = JSON.stringify(buildOutMessage(EOutCommands.UPDATE_ROOM, rooms));
      console.log(`Translate: ${roomResponse}`);
      this.translate(roomResponse);
    } else if (message.type === EInCommands.ADD_SHIPS) {
      const {
        data: { gameId, indexPlayer, ships },
      } = message;
      this.roomService.addShips(gameId, indexPlayer, ships);
    } else if (message.type === EInCommands.ATTACK) {
      const { data } = message;
      const { indexPlayer, gameId } = data;
      const { x, y } = data;
      const position: IPosition = { x, y };
      const isEndGame: boolean | undefined = this.roomService.attackHandler(
        gameId,
        indexPlayer,
        position,
      );
      if (isEndGame) {
        this.userServices.winnerProc(indexPlayer);
        const winner: IWinner[] = this.userServices.getWinners();
        const winnerResponce: string = JSON.stringify(
          buildOutMessage(EOutCommands.UPDATE_WINNERS, winner),
        );
        console.log(`Translate: ${winnerResponce}`);
        this.translate(winnerResponce);
      }
    } else if (message.type === EInCommands.RANDOM_ATTACK) {
      const { data } = message;
      const { indexPlayer, gameId } = data;
      const isEndGame: boolean | undefined = this.roomService.attackHandler(
        gameId,
        indexPlayer,
        null,
      );
      if (isEndGame) {
        this.userServices.winnerProc(indexPlayer);
        const winner: IWinner[] = this.userServices.getWinners();
        const winnerResponce: string = JSON.stringify(
          buildOutMessage(EOutCommands.UPDATE_WINNERS, winner),
        );
        console.log(`Translate: ${winnerResponce}`);
        this.translate(winnerResponce);
      }
    }
  }
}
