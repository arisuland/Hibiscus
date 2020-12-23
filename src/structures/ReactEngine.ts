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

import type { Request, Response } from './entity';
import { createElement } from 'react';
import DOMServer from 'react-dom/server';
import { join } from 'path';

/** Exported value of the properties for any component, this is meant to be extended */
export interface Properties {
  req: Request;
  res: Response;
}

/**
 * Rendering engine for React
 * @param req The request to add to the props object
 * @param res The response to add to the props object
 * @param path The path to the component
 * @param props Any additional props, if any to add to the component
 */
export default function render<Props extends object = {}>(req: Request, res: Response, path: string, props?: Props) {
  if (!path.endsWith('.js')) path += '.js';

  const filePath = join(process.cwd(), 'views', path);
  let html = '<!DOCTYPE html>';
  const component = require(filePath);

  if (!component.default) throw new SyntaxError(`Component "${path}" didn't export a default port.`);
  html += DOMServer.renderToStaticMarkup(createElement(component.default, {
    req,
    res,
    ...(props || {})
  }));

  return html;
}
