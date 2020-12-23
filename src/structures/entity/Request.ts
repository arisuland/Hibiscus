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

import type { IncomingHttpHeaders, IncomingMessage } from 'http';
import { parse, UrlWithParsedQuery } from 'url';
import { match } from 'path-to-regexp';

/** Represents a request that made a connection with Hibiscus */
export class Request<P extends object = object, B = unknown> {
  private _endpointPath: string;
  public headers: IncomingHttpHeaders;
  public method: string;
  private core: IncomingMessage;
  public body: B;
  public url: UrlWithParsedQuery;

  constructor(req: IncomingMessage, body: Buffer, path: string) {
    this._endpointPath = path;
    this.headers = req.headers;
    this.method = req.method || 'GET';
    this.body = JSON.parse(body.toString());
    this.core = req;
    this.url = parse(req.url!, true);
  }

  get query() {
    return this.url.query;
  }

  get params() {
    const matchFunc = match<P>(this._endpointPath);
    const result = matchFunc(this.core.url || '/');

    return result === false ? null : result.params;
  }
}
