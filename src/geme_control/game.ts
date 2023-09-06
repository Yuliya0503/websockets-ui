import { AttackStatus, IPosition, IShip, IShipData, PartState, ShipState } from '../models/common';
import { randomIntRange } from '../helpers/getRandom';

export default class Game {
  private static index = 0;
  public idGame: number;
  public isStarted = false;
  public ships = new Map<number, IShip[]>();
  private dataShips = new Map<number, IShipData[]>();
  private currPlayer: number;

  constructor() {
    this.idGame = Game.index;
    Game.index++;
    return this;
  }

  public startGame(): void {
    this.isStarted = true;

    this.ships.forEach((playerShips, playerId): void => {
      const playerShipData: IShipData[] = [];
      playerShips.forEach(({ position: { x, y }, direction, length }): void => {
        const dataShip: IShipData = {
          state: ShipState.Healthy,
          parts: [],
        };

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

  private attack(opponentId: number, position: IPosition): AttackStatus {
    const opponentShipData = this.dataShips.get(opponentId) as IShipData[];
    let status = AttackStatus.Miss;

    const updateOpponentShipData = opponentShipData.map(({ state, parts }) => {
      let updateShipState = state;

      let updatePart = parts.map(({ partState, x, y }) => {
        let updatePartState = partState;

        if (position.x === x && position.y === y) {
          status = AttackStatus.Shot;
          updatePartState = PartState.Damaged;
          updateShipState = ShipState.Damaged;
        }

        return {
          partState: updatePartState,
          x,
          y,
        };
      });

      const resPatrState = updatePart.every(({ partState }): boolean => {
        return partState === PartState.Damaged;
      });

      if (updatePart.length > 0 && resPatrState) {
        updatePart = [];
        updateShipState = ShipState.Sunk;
        status = AttackStatus.Killed;
      }

      return {
        state: updateShipState,
        parts: updatePart,
      };
    });

    this.dataShips.set(opponentId, updateOpponentShipData);
    return status;
  }

  public attackHandle(currentPlayer: number, opponentId: number, positionP: IPosition | null) {
    const position: IPosition = positionP || this.getRandom();
    const status: AttackStatus = this.attack(opponentId, position);

    return {
      currentPlayer,
      status,
      position,
    };
  }

  private getRandom(): IPosition {
    const randomeNumber: () => number = randomIntRange.bind(null, 0, 9);

    return {
      x: randomeNumber(),
      y: randomeNumber(),
    };
  }

  public endOfGameCheck(oppositId: number): boolean {
    const oppositDataShip = this.dataShips.get(oppositId) as IShipData[];

    const endOfCheck = oppositDataShip.every(({ state }): boolean => {
      return state === ShipState.Sunk;
    });

    return endOfCheck;
  }
}
