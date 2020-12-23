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

import { ServerResponse, STATUS_CODES } from 'http';

export class Response {
  private statusMessage: string | null;
  private statusCode: number;
  private headers: { [x: string]: string };
  private _res: ServerResponse;
  private data: any;

  constructor(core: ServerResponse) {
    this.statusMessage = null;
    this.statusCode = 200;
    this.headers = {};
    this._res = core;
    this.data = Buffer.alloc(0);
  }

  status(code: number) {
    if (code < 100 || code > 511) throw new TypeError(`code '${code}' can't exceed under 100 or over 511`);

    this.statusMessage = STATUS_CODES[code] || null;
    this.statusCode = code;

    return this;
  }

  send(data: any) {
    if (data instanceof Object) {
      if (!this.headers.hasOwnProperty('content-type')) this.headers['content-type'] = 'application/json';
      this.data = JSON.stringify(data);
    }

    this.data = data;
    return this.end();
  }

  end(data?: any) {
    if (data) this.data = data;

    if (this.statusMessage)
      this._res.writeHead(this.statusCode, this.statusMessage, this.headers);
    else
      this._res.writeHead(this.statusCode, this.headers);

    this._res.end(this.data);
  }
}
