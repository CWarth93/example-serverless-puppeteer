/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { isServer }) => {
		if (isServer) {
			// Don't bundle Chromium package so its bin/ (and .br files) are available at runtime on Vercel
			config.externals = config.externals || [];
			config.externals.push('@sparticuz/chromium');
		}
		return config;
	},
};

module.exports = nextConfig;
