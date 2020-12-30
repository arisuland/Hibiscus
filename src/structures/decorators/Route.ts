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

import type { Response, Request } from 'express';

type MaybePromise<T> = T | Promise<T>;
const SYMBOL = Symbol('$routes');

/** Represents a route */
export interface RouteDefinition {
  /**
   * The runner method to run when we hit this specific endpoint
   * @param req The request
   * @param res The response
   */
  run(req: Request, res: Response): MaybePromise<void>;

  /** The endpoint, this is merged with [Endpoint._mergePrefix] */
  endpoint: string;
}

/**
 * Returns all of the route definitions from the specified [target]
 * @param target The target
 */
export function getRouteDefinitions(target: any) {
  if (target.constructor === null) return [];

  const definitions = target.constructor[SYMBOL] as RouteDefinition[];
  if (!Array.isArray(definitions)) return [];

  return definitions;
}

/**
 * Decorator to indicate this method as a "Route"
 * @param endpoint The endpoint path to use
 */
export function Route(endpoint: string): MethodDecorator {
  return (target, prop, descriptor) => {
    const property = String(prop);
    if ((<any> target).prototype !== undefined) throw new TypeError(`Method "${target.constructor.name}#${property}" is static`);
    if (!target.constructor[SYMBOL]) target.constructor[SYMBOL] = [];

    (target.constructor[SYMBOL] as RouteDefinition[]).push({
      run: descriptor.value as any,
      endpoint
    });
  };
}
