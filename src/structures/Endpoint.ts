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

import type { RouteDefinition } from './decorators/Route';
import type { Server } from './Server';
import { Collection } from '@augu/immutable';

/** Represents a endpoint to interact with Hibiscus */
export class Endpoint {
  /** The server instance */
  public server!: Server;

  /** The prefix of this Endpoint to merge with routes */
  public prefix: string;

  /** List of routes available to this [Endpoint] */
  public routes: Collection<RouteDefinition>;

  /**
   * Static function to merge the [endpoint]'s prefix to the [path]'s prefix
   * @param endpoint The endpoint to merge
   * @param path The path to merge
   */
  static _mergePrefix(endpoint: Endpoint, path: string) {
    if (endpoint.prefix === path) return endpoint.prefix;
    return `${endpoint.prefix === '/' ? '' : endpoint.prefix}${path}`;
  }

  /**
   * Creates a new [Endpoint] instance
   * @param prefix The prefix to set
   */
  constructor(prefix: string) {
    this.prefix = prefix;
    this.routes = new Collection();
  }

  /**
   * Initialises this [Endpoint] to populate [Endpoint.server]
   * @param server The Hibiscus server running
   */
  init(server: Server) {
    this.server = server;
    return this;
  }

  /**
   * Appends all the routes from this [Endpoint] instance and adds them
   * @param routes The routes to append
   */
  append(routes: RouteDefinition[]) {
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      const path = Endpoint._mergePrefix(this, route.endpoint);

      this.routes.set(path, route);
    }
  }
}
