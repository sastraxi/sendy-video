module.exports = {
  reactStrictMode: true,
  webpack: (config, {isServer}) => {
    if (isServer) {
      // https://github.com/prisma/prisma/issues/6564 
      // remove when prisma pushes a fix w/undici@4
      config.externals.push('_http_common');
    }
    return config;
  },
  target: 'serverless',
}
