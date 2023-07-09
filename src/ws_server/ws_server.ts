import { WebSocketServer, Server } from 'ws';
import GameController from '../geme_control/gameController';

export default class WSServer {
  private port: number;
  private server: Server;
  private gameController: GameController;

  constructor(port: number) {
    this.port = port;
    this.server = new WebSocketServer({ port });
    this.gameController = new GameController(this.translate.bind(this));
  }

  public start(): void {
    this.server.on('listening', () => {
      console.log(`Start webSocket server on the ${this.port} port!`);
    });

    this.server.on('connection', (ws) => {
      ws.on('message', (data) => {
        try {
          this.gameController.incommMess(ws, data.toString());
        } catch(error) {
          console.error(error);
        }
      });
      ws.on('error', console.error);
    });
  }

  public translate(mess: string) {
    this.server.clients.forEach(client => {
      client.send(mess);
    })
  }
}
