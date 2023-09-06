import Room from './room';
import { IAuthenticatedWS } from '../models/iuser';
import { IPosition, IShip } from '../models/common';

export default class RoomService {
  private rooms: Room[] = [];

  public getRooms() {
    const resultRooms = this.rooms
      .filter(({ roomUsers }) => {
        return roomUsers.length < 2;
      })
      .map(({ roomId, roomUsers }) => {
        return { roomId, roomUsers };
      });
    return resultRooms;
  }

  private closeRoom(id: number): void {
    this.rooms = this.rooms.filter(({ roomId }) => roomId !== id);
  }

  private getRoomByUserId(id: number): Room | null {
    const room: Room | undefined = this.rooms.find(({ roomUsers }) => {
      return roomUsers.find((rUser) => rUser.index === id);
    });
    return room || null;
  }

  private getRoomByRoomId(id: number): Room | null {
    const room: Room | undefined = this.rooms.find(({ roomId }) => {
      return roomId === id;
    });
    return room || null;
  }

  private getRoomByGameId(id: number): Room | null {
    const room: Room | undefined = this.rooms.find(({ game }) => {
      return game.idGame === id;
    });
    return room || null;
  }

  public createRoom(ws: IAuthenticatedWS): Room | null {
    const roomExist: Room | null = this.getRoomByUserId(ws.index);
    if (roomExist) {
      console.error('Error: Player cannot create more than 1 room');
      return null;
    } else {
      const room = new Room(ws);
      this.rooms.push(room);
      return room;
    }
  }

  public addPlayerToRoom(ws: IAuthenticatedWS, indexRoom: number): void {
    const room: Room | null = this.getRoomByRoomId(indexRoom);
    if (this.getRoomByUserId(ws.index)) {
      console.error('Error: player cannot enter his own room');
      return;
    } else if (!room) {
      console.error('Error: room not found');
      return;
    }
    room.roomUsers.push({ name: ws.name, index: ws.index });
    room.sockets.push(ws);
    room.gameCreate();
  }

  public addShips(gameId: number, playerId: number, ships: IShip[]): void {
    const room: Room | null = this.getRoomByGameId(gameId);
    if (!room) {
      console.error('Error: room not found');
      return;
    }
    room.setPlayerShips(playerId, ships);
  }

  public attackHandler(
    gameId: number,
    playerId: number,
    position: IPosition | null,
  ): boolean | undefined {
    const room: Room | null = this.getRoomByGameId(gameId);
    if (!room) {
      console.log('No room');
      return;
    }
    const isEndGame: boolean = room.attackHandler(playerId, position);
    if (isEndGame) {
      this.closeRoom(room.roomId);
    }
    return isEndGame;
  }
}
