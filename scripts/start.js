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

const { existsSync } = require('fs');
const { exec } = require('child_process');
const { join } = require('path');
const Logger = require('./util/Logger');

const config = require(join(__dirname, '..', 'arisu.config.js'));
const logger = new Logger('Hibiscus');
let printed = false;

/**
 * Runs Hibiscus with a specified port
 * @param {number} port The port to use
 * @param {boolean} restart If we should restart the server if the process exists
 */
async function main(port, restart) {
  let proc;
  logger.info('Starting Hibiscus...');

  if (!existsSync(join(__dirname, '..', 'build'))) {
    logger.error('Missing \'build\' directory, did you compile it? (Hint: Use `npm run build` to build Hibiscus)');
    process.exit(1);
  }

  logger.info(`Booting up server using port ${port}, restart: ${restart ? 'yes' : 'no'}`);
  proc = spawn(restart);

  process.on('SIGINT', () => {
    logger.error('Received `SIGINT` signal, killing server');

    proc?.kill('SIGINT');
    proc = null;
    process.exit(0);
  });
}

function spawn(restart) {
  const proc = exec('node index.js', {
    cwd: join(__dirname, '..', 'build'),
    env: {
      INSTANCE_URL: config.instanceUrl || 'api.arisu.land',
      NODE_ENV: 'production'
    }
  });

  if (!printed) {
    printed = true;
    logger.info(`Spawned as process '${proc.pid}'`);
  }

  proc.stdout.on('data', chunk => console.log(chunk));
  proc.stderr.on('data', chunk => console.error(chunk));
  proc.once('exit', (code, signal) => {
    logger.warn(`ended server with code ${code}${signal ? `, signal '${signal}'` : ''}`);

    if (restart) {
      logger.info('respawning server');
      spawn(restart);
    } else {
      logger.error('keeping server dead');
    }
  });

  return proc;
}

const args = process.argv.slice(2);
const port = args.length > 0 ? Number(args[0]) : 3621;
const restart = args.length > 1 ? args[1] === '-r' || args[1] === '--restart' : true;

main(port, restart);
