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

const { inspect } = require('util');
const leeks = require('leeks.js');

/**
 * Represents a minimal logger for the `scripts` directory
 */
module.exports = class Logger {
  /**
   * Creates a new [Logger] instance
   * @param {string} name The name of the logger
   */
  constructor(name) {
    /**
     * The name of the logger
     * @type {string}
     */
    this.name = name;

    const levels = ['info', 'error', 'warn'];
    for (let i = 0; i < levels.length; i++)
      this[levels[i]] = (...messages) => this.write(levels[i], ...messages);
  }

  /**
   * Writes a message to the terminal
   * @param {'info' | 'warn' | 'error'} level The log level
   * @param  {...unknown} messages The message
   */
  write(level, ...messages) {
    let lvlText;
    switch (level) {
      case 'error':
        lvlText = leeks.hex('#FD5D5D', '[Error]');
        break;

      case 'warn':
        lvlText = leeks.hex('#FFFFC5', '[Warn]');
        break;

      case 'info':
        lvlText = leeks.hex('#BBE0E0', '[Info]');
        break;

      default:
        throw new TypeError(`Level '${level}' is invalid`);
    }

    const date = this._formatDate();
    const message = this._formatMessage(...messages);
    const name = leeks.hex('#AF8FEF', `[${this.name}]`);

    process.stdout.write(`${date} ${name} ${lvlText}     ${message}\n`);
  }

  _formatDate() {
    const current = new Date();

    const hours = current.getHours();
    const minutes = current.getMinutes();
    const seconds = current.getSeconds();
    const month = current.getMonth() + 1;
    const day = current.getDate();
    const year = current.getFullYear();

    return leeks.colors.gray(`[${day}/${month}/${year} @ ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}]`);
  }

  _formatMessage(...messages) {
    return messages.map(message => {
      if (typeof message === 'object' && !Array.isArray(message) && message !== null) return inspect(message, { depth: null, showHidden: false });
      if (typeof message === 'number') return message.toLocaleString();
      if (message instanceof Array) return message.map(m => this._formatMessage(m)).join('\n');
      if (message instanceof Date) return leeks.colors.cyan(message.toUTCString());

      return message;
    }).join('\n');
  }
};
