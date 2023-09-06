import fs from 'fs';
import path from 'path';
import http from 'http';

export default class HttpServer {
  private server: http.Server;
  private port: number;

  constructor(port: number) {
    this.port = port;
    this.server = http.createServer((request, response) => {
      const __dirname = path.resolve(path.dirname(''));
      const file_path =
        __dirname + (request.url === '/' ? '/front/index.html' : '/front' + request.url);

      fs.readFile(file_path, (error, data) => {
        if (error) {
          response.writeHead(404);
          response.end(JSON.stringify(error));
          return;
        }
        response.writeHead(200);
        response.end(data);
      });
    });
  }

  public start(): void {
    this.server.listen(this.port, () => {
      console.log(`Start static http server on the ${this.port} port!`);
    });
  }
}
