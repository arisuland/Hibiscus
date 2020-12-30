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

import express, { Application } from 'express';
import Config, { SSLConfig } from './Config';
import MiddlewareManager from './managers/MiddlewareManager';
import EndpointManager from './managers/EndpointManager';
import RequestHandler from './RequestHandler';
import SassManager from './managers/SassManager';
import { Logger } from './Logger';
import https from 'https';
import http from 'http';
import os from 'os';

export class Server {
  private _server!: http.Server;
  public middleware: MiddlewareManager;
  public endpoints: EndpointManager;
  public requests: RequestHandler;
  private logger: Logger;
  public config: Config;
  public sass: SassManager;
  public app: Application;

  constructor() {
    this.middleware = new MiddlewareManager(this);
    this.endpoints  = new EndpointManager(this);
    this.requests   = new RequestHandler(this);
    this.logger     = new Logger('Server');
    this.config     = new Config();
    this.sass       = new SassManager();
    this.app        = express();
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
      }, this.app)
      : http.createServer(this.app);

    this._server = server;

    this._server.on('error', error => {
      this.logger.error('Unable to create server', error);
      process.exit(1);
    });

    const prefix = ssl !== undefined ? 'https' : 'http';
    this._server.once('listening', () => {
      const address = this._server.address();
      const networks: string[] = [];

      if (typeof address === 'string') {
        networks.push(`- Sock "${address}"`);
      } else {
        if (address !== null) {
          if (address.address === '::') networks.push(`- Local: ${prefix}://localhost:${this.config.get<number>('port')}`);

          networks.push(`- Network: ${prefix}://${address.address}:${this.config.get<number>('port')}`);
        }
      }

      const additional = networks.concat(this.getNetworks().map(n =>
        `- Network: ${prefix}://${n}:${this.config.get<number>('port')}`
      ));

      this.logger.info('Hibiscus is listening at the following urls:', additional);
    });

    this._server.listen(this.config.get<number>('port')!);
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
}
