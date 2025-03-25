export const metadata = {
  title: 'Регистрация | Създаване на акаунт | Molly Food',
  description: 'Създайте акаунт в Molly Food и се възползвайте от по-бързо завършване на поръчките и проследяване на историята. Доставка на храна в София, Благоевград и Гоце Делчев.',
  keywords: ['регистрация', 'създаване на акаунт', 'молли акаунт', 'доставка храна', 'бърза поръчка'],
  alternates: {
    canonical: 'https://molly.bg/register'
  },
  openGraph: {
    title: 'Регистрация | Molly Food',
    description: 'Създайте акаунт и се възползвайте от персонализирани предложения и по-бързи поръчки.',
    url: 'https://molly.bg/register',
    siteName: 'Molly Food',
    images: [
      {
        url: 'https://molly.bg/giros-molly-logo.webp',
        width: 512,
        height: 512,
        alt: 'Molly Food Registration',
      }
    ],
    locale: 'bg_BG',
    type: 'website',
  }
};

export default function RegisterLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
} 