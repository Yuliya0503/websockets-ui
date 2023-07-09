import UserServices from "../user/userServices";
import { WebSocket } from "ws";
import { parseRawIncommingMessage } from "../helpers/parseRawIncMess";
import { EInCommands, EOutCommands } from "../models/commands";
import { buildOutMessage } from "../helpers/buildOutMess";

export default class GameController {
  private userServises = new UserServices();
  private translate: (mess: string) => void;

  constructor(translate: (mess: string) => void) {
    this.translate = translate;
  }

  public incommMess(ws: WebSocket, mess: string ) {
    console.log(`Received this message: "${mess}"`);
    const message = parseRawIncommingMessage(mess);
    if(message === null) {
      return null
    }else if(message.type === EInCommands.REGISTER) {
      const { data: { name, password } } = message;
      const registration = this.userServises.register(name, password, ws);
      const registrationResponse = JSON.stringify(buildOutMessage(EOutCommands.REGISTER, registration));
      console.log(`Responsed personal: ${registrationResponse}`);
      ws.send(registrationResponse);

      const winners = this.userServises.getWinners();
      const winnersResponse = JSON.stringify(buildOutMessage(EOutCommands.UPDATE_WINNERS, winners));
      console.log(`Responsed winners: ${winnersResponse}`);
      this.translate(winnersResponse);
    }    
  }
}
