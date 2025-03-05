export default async function sitemap() {
  // Базов URL на вашия сайт
  const baseUrl = 'https://molly-food-ordering.vercel.app';
  
  // Статични страници
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/menu`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/orders`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Тук можете да добавите динамично генерирани URL-и от базата данни
  // Например, URL-и за всеки продукт от менюто
  // const products = await getProducts();
  // const productUrls = products.map(product => ({
  //   url: `${baseUrl}/menu/${product._id}`,
  //   lastModified: product.updatedAt || new Date(),
  //   changeFrequency: 'weekly',
  //   priority: 0.8,
  // }));

  // Връщаме комбинирания масив от URL-и
  return [
    ...staticPages,
    // ...productUrls, // Разкоментирайте, когато добавите динамични URL-и
  ];
} 