/** @type {import('next').NextConfig} */
const nextConfig = {
    
  images: {
    remotePatterns: [
      // --- ADD THESE GOOGLE DOMAINS ---
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Common for Google user content
      },
      // --- It's good to also keep the Imgur domain for future use ---
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
       {
        protocol: 'https',
        hostname: 'plus.unsplash.com', 
      },
    ],
  },
};

export default nextConfig;