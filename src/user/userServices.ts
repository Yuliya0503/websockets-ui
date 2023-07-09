import { WebSocket } from "ws";
import User from "./user";
import { IAuthenticatedWS } from "../models/iuser";
import { IReg } from "../models/out";

export default class UserServices {
  private users: User[] = [];

  public register(name: string, pass: string, ws: WebSocket): IReg {
    const isUserExist = this.users.find(({ name: isNameExist }) => {
      return (isNameExist === name);
    });

    if(isUserExist && (isUserExist.pass === pass)) {
      (ws as IAuthenticatedWS).name = isUserExist.name;
      (ws as IAuthenticatedWS).index = isUserExist.index;
      
      return {
        name: isUserExist.name,
        index: isUserExist.index,
        error: false,
        errorText: '',
      }
    } else if (isUserExist && (isUserExist.pass !== pass)) {
      return {
        name: isUserExist.name,
        index: isUserExist.index,
        error: true,
        errorText: 'Wrong password!',
      }
    } else {
      const user = new User(name, pass);
      (ws as IAuthenticatedWS).name = user.name;
      (ws as IAuthenticatedWS).index = user.index;
      this.users.push(user);

      return {
        name: user.name,
        index: user.index,
        error: false,
        errorText: '',
      }
    }
  }
}