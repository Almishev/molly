import { Roboto } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/layout/ClientLayout';

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] })

export const metadata = {
  title: {
    default: 'Molly Food Ordering - Вкусна храна за всеки',
    template: '%s | Molly Food Ordering'
  },
  description: 'Molly Food Ordering - Поръчайте вкусна храна онлайн с бърза доставка до вашия дом или офис.',
  keywords: ['храна', 'доставка', 'пица', 'бургери', 'гирос', 'онлайн поръчка', 'molly', 'ресторант'],
  metadataBase: new URL('https://molly-food-ordering.vercel.app'),
  openGraph: {
    title: 'Molly Food Ordering - Вкусна храна за всеки',
    description: 'Поръчайте вкусна храна онлайн с бърза доставка до вашия дом или офис.',
    url: 'https://molly-food-ordering.vercel.app',
    siteName: 'Molly Food Ordering',
    images: [
      {
        url: 'https://molly-food-ordering.vercel.app/logo.png',
        width: 800,
        height: 600,
        alt: 'Molly Food Ordering Logo',
      }
    ],
    locale: 'bg_BG',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  verification: {
    google: 'google-site-verification-code', // Заменете с вашия код, когато го имате
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={roboto.className}>
        <main className="max-w-4xl mx-auto p-4">
          <ClientLayout>
            {children}
            <footer className="border-t p-8 text-center text-gray-200 mt-16">
              &copy; {new Date().getFullYear()} Всички права запазени
            </footer>
          </ClientLayout>
        </main>
      </body>
    </html>
  )
}
