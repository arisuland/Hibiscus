const { version } = require('./package.json');

/**
 * Next.js configuration
 * @type {import('next/dist/next-server/server/config').NextConfig}
 */
module.exports = {
  compress: true,
  distDir: 'build',
  trailingSlash: true,
  headers: async() => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'x-powered-by',
          value: `Hibiscus (https://github.com/arisuland/Hibiscus, v${version})`
        }
      ]
    }
  ]
};
