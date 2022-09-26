/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      fabric: 'fabric-pure-browser',
    }

    return config
  },
}

module.exports = nextConfig
