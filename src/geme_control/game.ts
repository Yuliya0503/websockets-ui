import { IShip } from '../models/common';

export default class Game {
  private static index = 0;
  idGame: number;
  isStarted = false;
  ships = new Map<number, IShip[]>() 

  constructor() {
    this.idGame = Game.index;
    Game.index++;
    return this;
  }

}