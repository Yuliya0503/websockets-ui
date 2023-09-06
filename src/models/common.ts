export interface IPosition {
  x: number;
  y: number;
}

export interface IShip {
  position: IPosition;
  direction: boolean;
  length: number;
  type: ShipType;
}

export enum ShipType {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  Huge = 'huge',
}

export enum ShipState {
  Healthy = 'healthy',
  Damaged = 'damaged',
  Sunk = 'sunk',
}

export enum PartState {
  Healthy = 'healthy',
  Damaged = 'damaged',
}

export interface IPart extends IPosition {
  partState: PartState;
}

export interface IShipData {
  state: ShipState;
  parts: IPart[];
}

export enum AttackStatus {
  Miss = 'miss',
  Killed = 'killed',
  Shot = 'shot',
}

export interface IIdentification {
  id: number;
}
