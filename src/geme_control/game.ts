import { IShip, IShipData, PartState, ShipState } from '../models/common';

export default class Game {
  private static index = 0;
  idGame: number;
  isStarted = false;
  ships = new Map<number, IShip[]>();
  private dataShips = new Map<number, IShipData[]>();
  private currPlayer: number;

  constructor() {
    this.idGame = Game.index;
    Game.index++;
    return this;
  }

  public startGame(): void {
    this.isStarted = true;
    this.ships.forEach((playerShips, playerId) => {
      const playerShipData: IShipData[] = [];
      playerShips.forEach(({ position: { x, y }, direction, length }) => {
        const dataShip: IShipData = { state: ShipState.Healthy, parts: [] };
        for (let i = 0; i < length; i++) {
          dataShip.parts.push({
            partState: PartState.Healthy,
            x: direction ? x : x + i,
            y: direction ? y + i : y,
          });
        }
        playerShipData.push(dataShip);
      });
      this.dataShips.set(playerId, playerShipData);
    });
  }

  public setCurrPlayer(id: number): void {
    this.currPlayer = id;
  }

  public getCurrPlayer(): number {
    return this.currPlayer;
  }
}
