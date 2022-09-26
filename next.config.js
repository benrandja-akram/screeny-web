/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack(config) {
    config.resolve = {
      ...config.resolve,
      alias: {
        fabric: 'fabric-pure-browser',
        ...config.resolve.alias,
      },
    }

    return config
  },
}

module.exports = nextConfig
