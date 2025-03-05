export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/private/',
        '/_next/',
        '/checkout/',
        '/menu-items/edit/',
        '/menu-items/delete/',
        '/categories/edit/',
        '/users/edit/',
      ],
    },
    sitemap: 'https://molly-food-ordering.vercel.app/sitemap.xml',
    host: 'https://molly-food-ordering.vercel.app',
  };
} 