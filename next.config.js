/** @type {import('next').NextConfig} */
const config = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'i.imgflip.com',
        },
      ],
      domains: ['i.ibb.co'],
    },
  };
  
  module.exports = config;