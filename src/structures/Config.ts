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

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

/** Represents what the `config.yml` should look like */
export interface Configuration {
  /**
   * The instance url for [Arisu](https://github.com/arisuland/Arisu), read the [setup guide](https://docs.arisu.land/guides/self-hosting) to learn how to self-host Arisu.
   */
  instanceUrl: string;

  /**
   * The port to connect to the world, this will do a round-robin style
   * if the port is taken, try a different one from 1024-65535 and edits if the
   * port provided is taken or not.
   */
  port?: number;

  /**
   * [Emi](https://docs.arisu.land/emi) configuration for sessions, read the [session guide](https://docs.arisu.land/hibiscus/redis-session) on
   * how and why we need Emi in Hibiscus.
   */
  emi: EmiConfig;

  /**
   * SSL configuration for Hibiscus, this'll create a `https.Server` instance
   * instead of a `http.Server` if this is defined.
   */
  ssl?: SSLConfig;
}

/** Represents what [Configuration.ssl] is */
export interface SSLConfig {
  /**
   * Path to the certificate file in PEM format, read the [SSL guide](https://docs.arisu.land/guides/self-hosting#hibiscus-ssl-guide)
   * on how to setup SSL support with Hibiscus
   */
  cert: string;

  /**
   * Path to the private key file in PEM format, read the [SSL guide](https://docs.arisu.land/guides/self-hosting#hibiscus-ssl-guide)
   * on how to setup SSL support with Hibiscus
   */
  key: string;

  /**
   * Overrides the default trusted CAs, read the [SSL guide](https://docs.arisu.land/guides/self-hosting#hibiscus-ssl-guide)
   * on how to setup SSL support with Hibiscus
   */
  ca?: string;
}

/** Represents the configuration for [Emi] */
interface EmiConfig {
  /** The instance URL for Emi, read the [Setup Guide](https://docs.arisu.land/emi/setup-guide) on how to setup Emi */
  instanceUrl: string;
}

/** Represents a class to handle configuration */
export default class Config {
  /** Represents the configuration cache available */
  private cache!: Configuration;

  /**
   * Loads the configuration file and populates [Config.cache]
   */
  load() {
    if (!existsSync(join(__dirname, '..', 'config.yml')))
      throw new SyntaxError(`Missing config.yml in '${join(__dirname, '..', 'config.yml')}'`);

    const contents = readFileSync(join(__dirname, '..', 'config.yml')).toString();
    const config: Configuration = <any> yaml.safeLoad(contents);

    this.cache = config;
    return config;
  }

  /**
   * Gets a key in the configuration file, if it doesn't exist, it'll use the
   * [defaultValue] provided. The key can be nested from objects using dot notation,
   * so `ssl.cert` will look for `cert` in the `ssl` object.
   *
   * @param key The key to find
   * @param defaultValue The default value
   * @returns The property found or the default value provided
   */
  get<T>(key: string, defaultValue: T): T;

  /**
   * Gets a key in the configuration file, if it doesn't exist,
   * it'll return `null`. The key can be nested from objects using dot notation,
   * so `ssl.cert` will look for `cert` in the `ssl` object.
   *
   * @param key The key to find
   * @returns The property found or `null` if nothing was found
   */
  get<T>(key: string): T | null;

  /**
   * Gets a key in the configuration file, if it doesn't exist, it'll use the
   * [defaultValue] provided or `null` if no [defaultValue] was specified.
   * The key can be nested from objects using dot notation, so `ssl.cert` will look for `cert` in the `ssl` object.
   *
   * @param key The key to find the property
   * @param defaultValue A specified default value if the property isn't found
   * @returns The property found, if [defaultValue] is specified, it'll use that if it's not found, or `null`
   * if [defaultValue] isn't specified
   */
  get<T>(key: string, defaultValue?: T) {
    const nodes = key.split('.');
    let prop: any = this.cache;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      try {
        prop = prop[node];
      } catch {
        prop = '<not found>';
        break;
      }
    }

    if (prop === '<not found>') throw new TypeError(`Couldn't find anything in nodes '${nodes.join('.')}'`);

    if (defaultValue) {
      return (prop === null || prop === void 0) ? defaultValue : prop;
    } else {
      return (prop === null || prop === void 0) ? null : prop;
    }
  }

  /**
   * Sets a property of a value and dumps it to `config.yml`
   * @param key The key to set the value
   * @param value The value to set
   */
  set<K extends keyof Configuration>(key: K, value: Configuration[K]) {
    const cache = this.cache[key];
    if (!cache) throw new TypeError(`Key '${key}' doesn't exist`);

    this.cache[key] = value;
    const config = yaml.safeDump(this.cache, {
      indent: 2
    });

    writeFileSync(join(__dirname, '..', 'config.yml'), config);
  }
}
