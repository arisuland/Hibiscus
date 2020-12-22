const { resolve } = require('path');

/**
 * Represents the configuration for Hibiscus
 * @type {HibiscusConfig}
 */
module.exports = {
  instanceUrl: 'https://arisu.land',
  buildDir: resolve(__dirname, 'build')
};

/**
 * @typedef {object} HibiscusConfig The configuration file for [arisu.config.js]
 * @prop {string} [instanceUrl='https://arisu.land'] The URL of your Arisu instance, read the [Self-hosting](https://docs.arisu.land/guides/self-hosting) guide.
 * @prop {string} [buildDir='./build'] The build directory to place all of TypeScript's compiled JavaScript in
 */
