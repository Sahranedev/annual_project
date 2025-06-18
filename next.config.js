/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:1337/api/:path*',
            },
        ];
    },
};

module.exports = nextConfig; 