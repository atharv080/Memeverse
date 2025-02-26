/** @type {import('next').NextConfig} */
const config = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'i.imgflip.com',
        },
      ],
    },
  };
  
  module.exports = config;