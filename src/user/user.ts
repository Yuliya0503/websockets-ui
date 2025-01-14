import { IUser } from '../models/iuser';

export default class User implements IUser {
  private static index = 0;
  public name: string;
  public index: number;
  public pass: string;

  constructor(name: string, pass: string) {
    this.name = name;
    this.pass = pass;
    this.index = User.index;
    User.index++;
  }
}
