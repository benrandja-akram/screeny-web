/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      fabric: 'fabric-pure-browser',
      'node-canavs': '@napi-rs/canvas',
    }

    return config
  },
}

module.exports = nextConfig
