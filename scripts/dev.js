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

const { existsSync, promises: fs, watch, watchFile } = require('fs');
const { join, resolve } = require('path');
const { exec } = require('child_process');
const Logger = require('./util/Logger');

const logger = new Logger('Dev Server');
const watchers = {};
let printed = false;
let locked = false;

const config = require(join(__dirname, '..', 'arisu.config.js'));

async function main() {
  logger.info('spawning development server...');
  logger.info('arisu.config.js file ->', config);

  if (!existsSync(join(__dirname, '..', 'build'))) {
    logger.error('unable to spawn dev server without stuff being compiled. (hint: run `npm run build` before running this)');
    process.exit(1);
  }

  const files = await readdir(join(__dirname, '..', 'build'));
  let proc;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const w = watch(file, { persistent: true, interval: 1000 }, (e, i) => onFileChange(e, i, () => {
      const stats = watchers[file];
      const nStats = {
        changed: (stats.changed || 0) + 1,
        watcher: stats.watcher
      };

      watchers[file] = nStats;
      logger.warn(`received ${nStats.changed.toLocaleString()} file changes on file "${file}"`);

      proc.kill('SIGINT');
      proc = null;
      proc = spawn();
    })).unref();

    w.on('error', error =>
      logger.error('Unable to receive file change event', error)
    );

    watchers[file] = {
      changed: 0,
      watcher: w
    };
  }

  proc = spawn();

  logger.info('displaying stats', {
    watchers: `${Object.keys(watchers).length.toLocaleString()} available`,
    platform: process.platform,
    pid: proc.pid
  });

  process.on('SIGINT', () => {
    logger.warn('received `SIGINT` event, assuming to kill process');

    proc.kill('SIGINT');
    process.exit(0);
  });
}

async function onFileChange(event, filename, callback) {
  if (event === 'change' && filename) {
    if (locked) return; // this can do a lot of funky stuff

    locked = true;
    setTimeout(() => {
      locked = false;
    }, 150);

    callback();
  }
}

function spawn() {
  const proc = exec('node index.js --dev', {
    cwd: join(__dirname, '..', 'build'),
    env: {
      INSTANCE_URL: config.instanceUrl || 'https://arisu.land',
      NODE_ENV: 'development'
    }
  });

  if (!printed) {
    logger.info(`spawned dev server as pid ${proc.pid}`);
    printed = true;
  }

  proc.stdout.on('data', chunk => console.log(chunk));
  proc.stderr.on('data', chunk => console.log(chunk));
  proc.once('exit', (code, signal) => {
    if (!printed) logger.warn(`ended development server with code ${code}${signal ? `, signal '${signal}'` : ''}`);

    if (code !== null) process.exit(code);
  });

  return proc;
}

const readdir = async (path) => {
  let results = [];
  const files = await fs.readdir(path);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const stats = await fs.lstat(join(path, file));

    if (stats.isDirectory()) {
      const r = await readdir(join(path, file));
      results = results.concat(r);
    } else {
      results.push(join(path, file));
    }
  }

  return results;
};

main();
