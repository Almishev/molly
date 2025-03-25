export const metadata = {
  title: 'Вашите Поръчки | История и статус | Molly Food',
  description: 'Прегледайте историята на вашите поръчки, проследете статуса на текущи поръчки и поръчайте отново любимите си ястия от Molly Food.',
  keywords: ['поръчки', 'история на поръчки', 'статус на поръчка', 'молли', 'доставка храна'],
  alternates: {
    canonical: 'https://molly.bg/orders'
  },
  robots: {
    index: false,  // Не индексираме страницата с поръчки, тя е лична
    follow: true,
  },
  openGraph: {
    title: 'Вашите Поръчки | Molly Food',
    description: 'Прегледайте историята и статуса на вашите поръчки в Molly Food.',
    url: 'https://molly.bg/orders',
    siteName: 'Molly Food',
    images: [
      {
        url: 'https://molly.bg/giros-molly-logo.webp',
        width: 512,
        height: 512,
        alt: 'Molly Food Orders',
      }
    ],
    locale: 'bg_BG',
    type: 'website',
  }
};

export default function OrdersLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
} 