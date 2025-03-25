export const metadata = {
  title: 'Меню | Гироси, Бургери и Други Вкусни Ястия | Molly',
  description: 'Вижте нашето пълно меню с гироси, бургери, салати и други вкусни ястия. Разгледайте всички категории и поръчайте онлайн с доставка в София, Благоевград и Гоце Делчев.',
  keywords: ['меню', 'гирос', 'бургери', 'салати', 'доставка храна', 'Гоце Делчев', 'София', 'Благоевград'],
  alternates: {
    canonical: 'https://molly.bg/menu'
  },
  openGraph: {
    title: 'Нашето Меню | Molly Food',
    description: 'Вижте нашето пълно меню с гироси, бургери, салати и други вкусни ястия. Поръчайте онлайн с доставка.',
    url: 'https://molly.bg/menu',
    images: [
      {
        url: 'https://molly.bg/giros-molly-logo.webp',
        width: 512,
        height: 512,
        alt: 'Molly Food Menu',
      }
    ],
    locale: 'bg_BG',
    type: 'website',
  }
};

export default function MenuLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
} 