import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	output: 'standalone',
	eslint: {
		ignoreDuringBuilds: true
	},
	typescript: {
		ignoreBuildErrors: true
	},
	images: {
		unoptimized: true
	},
	experimental: {
		webpackBuildWorker: true,
		parallelServerBuildTraces: true,
		parallelServerCompiles: true
	}
}

export default nextConfig
