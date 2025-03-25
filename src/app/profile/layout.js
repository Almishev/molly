export const metadata = {
  title: 'Вашият Профил | Настройки на акаунта | Molly Food',
  description: 'Управлявайте вашия профил, адреси за доставка и предпочитания. Вижте история на поръчките и запазени любими ястия в Molly Food.',
  keywords: ['профил', 'акаунт', 'потребителски настройки', 'молли', 'доставка храна'],
  alternates: {
    canonical: 'https://molly.bg/profile'
  },
  robots: {
    index: false,  // Не индексираме личната страница на потребителя
    follow: true,
  },
  openGraph: {
    title: 'Вашият Профил | Molly Food',
    description: 'Управлявайте вашите данни, адреси и предпочитания в Molly Food.',
    url: 'https://molly.bg/profile',
    siteName: 'Molly Food',
    images: [
      {
        url: 'https://molly.bg/giros-molly-logo.webp',
        width: 512,
        height: 512,
        alt: 'Molly Food Profile',
      }
    ],
    locale: 'bg_BG',
    type: 'website',
  }
};

export default function ProfileLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
} 