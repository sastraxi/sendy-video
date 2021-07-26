const withImages = require('next-images');

module.exports = withImages({
  reactStrictMode: true,
  webpack: (config, {isServer}) => {
    if (isServer) {
      // https://github.com/prisma/prisma/issues/6564 
      // remove when prisma pushes a fix w/undici@4
      config.externals.push('_http_common');
    }
    return config;
  },
  // https://github.com/netlify/netlify-plugin-nextjs/issues/527
  // apparently vercel automatically does this, so this is for netlify
  target: 'experimental-serverless-trace',
});
