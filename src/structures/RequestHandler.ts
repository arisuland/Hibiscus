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

import type { Request, Response } from 'express';
import APIRequestHandler from './requests/APIRequestHandler';
import EmiRequestHandler from './requests/EmiRequestHandler';
import type { Server } from './Server';
import { Logger } from './Logger';

/** The request handler for handling incoming requests and helper utility for making requests to the API and Emi */
export default class RequestHandler {
  private server: Server;
  private logger: Logger;

  /** The API request handler */
  public api: APIRequestHandler;

  /** Request handler for [Emi](https://docs.arisu.land/Emi) */
  public emi: EmiRequestHandler;

  /**
   * Creates a new [RequestHandler] instance
   * @param server The server instance
   */
  constructor(server: Server) {
    this.server = server;
    this.logger = new Logger('RequestHandler');
    this.api = new APIRequestHandler(server.config.get<string>('instanceUrl')!);
    this.emi = new EmiRequestHandler(server.config.get<string>('emi.instanceUrl')!);
  }

  handle(req: Request, res: Response) {
    this.logger.info(`-> ${req.method.toUpperCase()} ${req.url}`);
  }
}
