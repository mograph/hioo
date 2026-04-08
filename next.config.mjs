/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.experiments = {
        ...config.experiments,
        asyncWebAssembly: true,
      }
    }
    // Prevent @imgly/background-removal from being bundled server-side
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push('@imgly/background-removal')
    }
    return config
  },
}

export default nextConfig
