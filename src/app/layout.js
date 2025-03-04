import { Roboto } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/layout/ClientLayout';

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] })

export const metadata = {
  title: 'Molly - Най-вкусните гръцки гироси',
  description: 'Опитай най-добрата пица и гирос в града! Вкусни ястия, направени с любов и свежи съставки.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={roboto.className}>
        <main className="max-w-4xl mx-auto p-4">
          <ClientLayout>
            {children}
            <footer className="border-t p-8 text-center text-gray-500 mt-16">
              &copy; {new Date().getFullYear()} Всички права запазени
            </footer>
          </ClientLayout>
        </main>
      </body>
    </html>
  )
}
