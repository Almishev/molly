export default function sitemap() {
  const baseUrl = 'https://molly-food-ordering.vercel.app';
  
  // Основни страници
  const routes = [
    '',
    '/menu',
    '/cart',
    '/login',
    '/register',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
} 