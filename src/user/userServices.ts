import { WebSocket } from 'ws';
import User from './user';
import { IAuthenticatedWS, IWinner } from '../models/iuser';
import { IReg } from '../models/out';

export default class UserServices {
  private users: User[] = [];
  private winners: IWinner[] = [];

  public register(name: string, pass: string, ws: WebSocket): IReg {
    const isUserExist: User | undefined = this.users.find(({ name: isNameExist }) => {
      return isNameExist === name;
    });

    if (isUserExist && isUserExist.pass === pass) {
      (ws as IAuthenticatedWS).name = isUserExist.name;
      (ws as IAuthenticatedWS).index = isUserExist.index;

      return {
        name: isUserExist.name,
        index: isUserExist.index,
        error: false,
        errorText: '',
      };
    } else if (isUserExist && isUserExist.pass !== pass) {
      return {
        name: isUserExist.name,
        index: isUserExist.index,
        error: true,
        errorText: 'Wrong password!',
      };
    } else {
      const user = new User(name, pass);
      (ws as IAuthenticatedWS).name = user.name;
      (ws as IAuthenticatedWS).index = user.index;
      this.users.push(user);
      this.winners.push({ name, wins: 0 });

      return {
        name: user.name,
        index: user.index,
        error: false,
        errorText: '',
      };
    }
  }

  public getWinners(): IWinner[] {
    return this.winners;
  }

  public winnerProc(playerId: number): void {
    const user = this.users.find(({ index }) => {
      return index === playerId;
    }) as User;

    this.winners = this.winners
      .map(({ name, wins }) => {
        return name === user.name ? { name, wins: wins + 1 } : { name, wins };
      })
      .sort((winI, winJ) => {
        return winJ.wins - winI.wins;
      });
  }
}
