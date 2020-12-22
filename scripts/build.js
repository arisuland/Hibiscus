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

const { exec } = require('child_process');
const { join } = require('path');
const Logger = require('./util/Logger');

const logger = new Logger('TypeScript');
function main() {
  logger.info('spinning up child process...');

  const proc = exec('tsc', { cwd: join(__dirname, '..') });
  let success = true;

  logger.info(`spawned as pid ${proc.pid}`);
  proc.stdout.on('data', chunk => logger.info(chunk));
  proc.stderr.on('data', chunk => logger.error(chunk));

  proc.on('error', error => {
    logger.error('Unable to process TypeScript build', error);
    success = false;
  });

  proc.once('exit', (code, signal) => {
    success = code === 0;
    logger.info(`\`tsc\` has closed with code ${code}${signal ? ` with signal "${signal}"` : ''}, success: ${success ? 'yes' : 'no'}`);
  });
}

main();
