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

const { ESLint } = require('eslint');
const { join } = require('path');
const Logger = require('./util/Logger');

const logger = new Logger('ESLint');
async function main() {
  logger.info('linting files...');

  const linter = new ESLint({
    overrideConfigFile: join(__dirname, '..', '.eslintrc.json'),
    extensions: ['js', 'ts'],
    ignorePath: join(__dirname, '..', '.eslintignore')
  });

  const results = await linter.lintFiles(['src', 'scripts']);
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.errorCount > 0) {
      const messages = [];

      for (let j = 0; j < result.messages.length; j++) {
        const m = result.messages[j];
        let message = `X  ${m.ruleId}: ${m.message} (${result.filePath}:${m.line}:${m.column})`;

        messages.push(message);
      }

      logger.error('', messages);
      break; // continue
    }

    if (result.warningCount > 0) {
      const messages = [];
      for (let j = 0; j < result.messages.length; j++) {
        const m = result.messages[j];
        let message = `?  ${m.ruleId}: ${m.message} (${result.filePath}:${m.line}:${m.column})`;

        messages.push(message);
      }

      logger.warn('', messages);
      break; // continue
    }

    if (i === results.length - 1)
      logger.info('No inconsistent code-style anywhere.');
  }
}

main();
