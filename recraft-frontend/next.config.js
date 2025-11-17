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
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com', // Google image search results
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn1.gstatic.com', // Google image search results
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn2.gstatic.com', // Google image search results
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn3.gstatic.com', // Google image search results
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