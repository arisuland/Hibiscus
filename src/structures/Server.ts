/**
 * Copyright (c) 2020 Arisu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import Config, { SSLConfig } from './Config';
import MiddlewareManager from './managers/MiddlewareManager';
import EndpointManager from './managers/EndpointManager';
import RequestHandler from './RequestHandler';
import SassManager from './managers/SassManager';
import { Logger } from './Logger';
import https from 'https';
import http from 'http';
import net from 'net';
import os from 'os';

export class Server {
  private _server!: http.Server;
  public middleware: MiddlewareManager;
  public endpoints: EndpointManager;
  public requests: RequestHandler;
  private logger: Logger;
  public config: Config;
  public sass: SassManager;

  constructor() {
    this.middleware = new MiddlewareManager(this);
    this.endpoints  = new EndpointManager(this);
    this.requests   = new RequestHandler(this);
    this.logger     = new Logger('Server');
    this.config     = new Config();
    this.sass       = new SassManager();
  }

  async init() {
    this.logger.info('Booting up server...');

    // Run all managers so we have valid endpoints, middleware, and static cache
    await this.middleware.init();
    await this.endpoints.init();
    await this.sass.init();

    // Now we load the configuration
    this.config.load();

    const ssl = this.config.get<SSLConfig | undefined>('ssl', undefined);
    const server = ssl !== undefined
      ? https.createServer({
        cert: ssl.cert,
        key: ssl.key,
        ca: ssl.ca
      }, (req, res) => this.requests.handle(req, res)) : http.createServer((req, res) => this.requests.handle(req, res));

    this._server = server;

    this._server.on('error', error => {
      this.logger.error('Unable to create server', error);
      process.exit(1);
    });

    this._server.once('listening', () => {
      const networks = this.getNetworks();
      this.logger.info('Hibiscus is listening at the following urls:', networks.map(network =>
        `- ${ssl !== undefined ? 'https' : 'http'}://${network}:${this.config.get<number>('port')}`)
      );
    });

    await this._runServer();
  }

  private getNetworks() {
    const networks: string[] = [];
    const all = os.networkInterfaces();

    for (const name of Object.keys(all)) {
      for (const _interface of all[name]!) {
        const { address, family, internal } = _interface;
        if (family === 'IPv4' && !internal) networks.push(address);
      }
    }

    return networks;
  }

  private getAvailablePort(port: number) {
    const getRandomPort = () => Math.floor(Math.random() * (65535 - 1024) + 1024);
    let chances = 0;

    function isAvailable(port?: number) {
      if (!port) port = getRandomPort();
      if (port < 1024 || port > 65535) port = getRandomPort();

      // It shouldn't reach this but it's better then sorry?
      if (chances > 5) return Promise.reject(new Error('Chances exceeded to 5, not trying again.'));
      return new Promise<number>((resolve, reject) => {
        chances++;

        const timeout = setTimeout(() => reject(new Error(`Port '${port}' is taken, but not resolving`)), 15000).unref();
        const socket = net.createConnection({ port: port! }, () => {
          clearTimeout(timeout);
          socket.end();

          reject(new Error(`Port '${port}' is taken, try again.`));
        });

        socket.once('error', (error) => {
          if (error.message.includes('connect ECONNREFUSED')) return resolve(port!);

          clearTimeout(timeout);
          return reject(error);
        });
      });
    }

    const current = port;
    const onSuccess = (port: number) => {
      if (port !== current) {
        this.config.set('port', port);
        this.logger.warn(`Port '${current}' is available, now using it (provided: ${current})`);

        return port;
      } else {
        return current;
      }
    };

    const onError = (error: any) => {
      if (error.message.includes('taken')) {
        this.logger.warn(`Port '${current}' was taken, running again...`);
        return isAvailable();
      }

      this.logger.error('Unable to find available port', error);
      return getRandomPort(); // use a random port
    };

    return isAvailable(port)
      .then(onSuccess)
      .catch(onError);
  }

  private async _runServer() {
    this.logger.info('Now running server...');

    const port = await this.getAvailablePort(this.config.get<number>('port')!);
    this._server.listen(port);
  }
}
