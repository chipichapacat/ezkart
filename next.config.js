/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        domains:['firebasestorage.googleapis.com','m.media-amazon.com','lh3.googleusercontent.com']
    },
    // experimental: {
    //     appDir: true,
    // },
    // async headers() {
    //     return [
    //         {
    //             source: '/(.*)',
    //             headers: [
    //                 {
    //                     key: 'Cache-Control',
    //                     value: 'no-store'
    //                 }
    //             ],
    //         }
    //     ]
    // },

}

module.exports = nextConfig
