export interface IPosition {
  x: number,
  y: number,
}

export interface IShip {
  position: IPosition,
  direction: boolean,
  length: number,
  type: ShipType,
}

export enum ShipType {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  Huge = 'huge'
}

export enum AttackStatus {
  Miss = 'miss',
  Killed = 'killed',
  Shot = 'shot'
}