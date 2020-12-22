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

const { existsSync, promises: fs, watch, readFileSync } = require('fs');
const { createHmac, createHash } = require('crypto');
const { exec } = require('child_process');
const { join } = require('path');
const Logger = require('./util/Logger');

const logger = new Logger('Dev Server');
let watcher;
const timeouts = {};
const prevHash = {};
let printed = false;

const config = readFileSync(join(__dirname, '..', 'arisu.config.js'), { encoding: 'utf8' });

async function main() {
  logger.info('spawning development server...');

  if (!existsSync(join(__dirname, '..', 'build'))) {
    logger.error('unable to spawn dev server without stuff being compiled. (hint: run `npm run build` before running this)');
    process.exit(1);
  }

  const files = await readdir(join(__dirname, '..', 'build'));
  let proc;

  watcher = watch(
    join(__dirname, '..', 'build'),
    { persistent: true, recursive: true },
    (event, filename) => onFileChange(event, join(__dirname, '..', 'build', filename), () => {
      // this is called when we edited it
      logger.info(`File '${filename}' was edited, re-spawning server...`);

      proc.kill();
      proc = null;
      proc = spawn();
    }));

  proc = spawn();

  process.on('SIGINT', () => {
    logger.warn('received `SIGINT` event, assuming to kill process');

    if (watcher) watcher.close();
    proc.kill('SIGINT');
    process.exit(0);
  });
}

async function onFileChange(event, filename, callback) {
  console.log(`event ${event}? (filename = ${filename})`);

  if (event === 'change' && filename) {
    if (timeouts[filename]) return logger.warn('deadlock bitches');
    timeouts[filename] = setTimeout(() => {
      delete timeouts[filename];
    }, 250);

    logger.info(`filename '${filename}' has been changed`);
    const contents = await fs.readFile(filename);
    const hash = createHash('md5').update(contents).digest('hex');

    if (prevHash[filename] === undefined || prevHash[filename] !== hash) {
      prevHash[filename] = hash;
      return callback();
    } else {
      logger.warn('same hash????');
    }
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

    if (watcher) watcher.close();
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
