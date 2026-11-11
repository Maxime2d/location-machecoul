/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // @vercel/blob (et sa dépendance undici) sont chargés directement par Node
    // au lieu d'être empaquetés : leur syntaxe récente n'est pas gérée par le
    // bundler de Next 14.1.
    serverComponentsExternalPackages: ['@vercel/blob', 'undici'],
  },
}

module.exports = nextConfig
