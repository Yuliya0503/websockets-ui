import HttpServer from './src/http_server/index';
import WSServer from './src/ws_server/ws_server';

const WS_PORT = 3000;
const HTTP_PORT = 8181;

const httpServer = new HttpServer(HTTP_PORT);
const wsServer = new WSServer(WS_PORT);
httpServer.start();
wsServer.start();
