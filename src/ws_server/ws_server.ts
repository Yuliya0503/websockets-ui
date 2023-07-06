import { WebSocketServer, Server } from "ws";

export default class WSServer {
  private port: number;
  private server: Server;

  constructor(port:number) {
    this.port = port;
    this.server = new WebSocketServer({ port });
  }

  public start(): void {
    this.server.on('listening', () => {
      console.log(`Start webSocket server on the ${this.port} port!`);
    });

    this.server.on('custom', () => {
      console.log('custom event');
    });
  }
}