export const metadata = {
  title: 'Вход | Molly Food Доставка',
  description: 'Влезте във вашия акаунт за да проследявате поръчките си и да получите бързо обслужване при новите поръчки. Доставка на храна в София, Благоевград и Гоце Делчев.',
  keywords: ['вход', 'логин', 'акаунт', 'доставка на храна', 'молли'],
  alternates: {
    canonical: 'https://molly.bg/login'
  },
  openGraph: {
    title: 'Вход в системата | Molly Food',
    description: 'Влезте във вашия акаунт за да управлявате поръчките си и да получите персонализирано обслужване.',
    url: 'https://molly.bg/login',
    siteName: 'Molly Food',
    images: [
      {
        url: 'https://molly.bg/giros-molly-logo.webp',
        width: 512,
        height: 512,
        alt: 'Molly Food Login',
      }
    ],
    locale: 'bg_BG',
    type: 'website',
  }
};

export default function LoginLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
} 