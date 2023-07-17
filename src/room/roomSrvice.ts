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

  closeRoom(id: number): void {
    this.rooms = this.rooms.filter(({ roomId }) => roomId !== id);
  }

  getRoomByUserId(id: number): Room | null {
    const room = this.rooms.find(({ roomUsers }) => {
      return roomUsers.find((rUser) => rUser.index === id);
    });
    return room || null;
  }

  getRoomByRoomId(id: number): Room | null {
    const room = this.rooms.find(({ roomId }) => {
      return roomId === id;
    });
    return room || null;
  }

  getRoomByGameId(id: number): Room | null {
    const room = this.rooms.find(({ game }) => {
      return game.idGame === id;
    });
    return room || null;
  }

  createRoom(ws: IAuthenticatedWS): Room | null {
    const roomExist = this.getRoomByUserId(ws.index);
    if (roomExist) {
      console.error('Error: Player cannot create more than 1 room');
      return null;
    } else {
      const room = new Room(ws);
      this.rooms.push(room);
      return room;
    }
  }

  addPlayerToRoom(ws: IAuthenticatedWS, indexRoom: number) {
    const room = this.getRoomByRoomId(indexRoom);
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

  addShips(gameId: number, playerId: number, ships: IShip[]) {
    const room = this.getRoomByGameId(gameId);
    if (!room) {
      console.error('Error: room not found');
      return;
    }
    room.setPlayerShips(playerId, ships);
  }

  attackHandler(gameId: number, playerId: number, position: IPosition | null) {
    const room = this.getRoomByGameId(gameId);
    if (room === null) {
      console.log('No room');
      return;
    }
    const isEndGame = room.attackHandler(playerId, position);
    if (isEndGame) {
      this.closeRoom(room.roomId);
    }
    return isEndGame;
  }
}
