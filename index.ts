import HttpServer from './src/http_server/index';

//const WS_PORT = 3000;
const HTTP_PORT = 8181;

const httpServer = new HttpServer(HTTP_PORT);
httpServer.start();
