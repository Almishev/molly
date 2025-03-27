export const metadata = {
  title: 'Вашата Количка | Преглед на Поръчката | Molly Гироси',
  description: 'Преглед на вашата количка и завършване на поръчката. Поръчайте гироси, бургери и други ястия онлайн с доставка в София, Благоевград и Гоце Делчев.',
  keywords: ['количка', 'поръчка', 'доставка', 'гироси', 'бургери', 'онлайн поръчка'],
  alternates: {
    canonical: 'https://molly.bg/cart'
  },
  openGraph: {
    title: 'Количка за Пазаруване | Molly Food',
    description: 'Преглед на вашата количка и завършване на поръчката с доставка до вашия дом.',
    url: 'https://molly.bg/cart',
    siteName: 'Molly Food',
    images: [
      {
        url: 'https://molly.bg/giros-molly-logo.webp',
        width: 512,
        height: 512,
        alt: 'Molly Food Cart',
      }
    ],
    locale: 'bg_BG',
    type: 'website',
  }
};

export default function CartLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
} 