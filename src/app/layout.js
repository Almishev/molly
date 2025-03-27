import { Roboto } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/layout/ClientLayout';
import Script from 'next/script';

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] })

export const metadata = {
  title: {
    default: 'Molly - Гироси и Бургери | Доставка на храна в Гоце Делчев',
    template: '%s | Molly Food'
  },
  description: 'Вкусни гироси и бургери в София и Гоце Делчев. Бърза доставка на храна за вкъщи в град Гоце Делчев. Прясно приготвена храна от качествени продукти.',
  keywords: [
    'гирос', 'дюнер', 'храна за вкъщи', 'доставка на храна',
    'ресторант Гоце Делчев', 'храна Гоце Делчев', 'гирос София',
    'дюнер Благоевград', 'бърза храна', 'гръцка кухня',
    'доставка храна Гоце Делчев', 'ресторант', 'molly food'
  ],
  metadataBase: new URL('https://molly.bg'),
  openGraph: {
    title: 'Molly - Гироси и Бургери | Доставка на храна',
    description: 'Вкусни гироси и бургери в София, Благоевград и Гоце Делчев. Бърза доставка на храна за вкъщи в град Гоце Делчев.',
    url: 'https://molly.bg',
    siteName: 'Molly Food',
    images: [
      {
        url: 'https://molly.bg/logo-molly-goce-delchev.jpg',
        width: 512,
        height: 512,
        alt: 'Molly Food - Вкусна храна с доставка',
      }
    ],
    locale: 'bg_BG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Molly - Гироси и Бургери | Доставка на храна',
    description: 'Вкусни гироси и бургери в София, Благоевград и Гоце Делчев. Бърза доставка на храна за вкъщи в град Гоце Делчев.',
    images: ['https://molly.bg/logo-molly-goce-delchev.jpg'],
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
    icon: [
      { url: '/logo-molly-goce-delchev.jpg', sizes: 'any' }
    ],
    shortcut: '/logo-molly-goce-delchev.jpg',
    apple: '/logo-molly-goce-delchev.jpg',
    other: [
      {
        rel: 'apple-touch-icon',
        url: '/logo-molly-goce-delchev.jpg',
      },
      {
        rel: 'icon',
        type: 'image/jpeg',
        sizes: '32x32',
        url: '/logo-molly-goce-delchev.jpg',
      },
      {
        rel: 'icon',
        type: 'image/jpeg',
        sizes: '16x16',
        url: '/logo-molly-goce-delchev.jpg',
      }
    ]
  },
  verification: {
    google: 'PnwDloJ9UapcB0B5c9xEoI7swQs5vtV78xkbE_VfWcA', // Заменете с вашия код, когато го имате
    
  },
  alternates: {
    canonical: 'https://molly.bg'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="bg" className="scroll-smooth">
      <head>
        <Script
          id="schema-restaurant"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              "name": "Molly Food",
              "image": "https://molly.bg/logo-molly-goce-delchev.jpg",
              "url": "https://molly.bg",
              "telephone": "+359899071718",
              "servesCuisine": ["Гръцка кухня", "Бърза храна", "Гироси", "Бургери"],
              "priceRange": "$$",
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
                ],
                "opens": "10:00",
                "closes": "22:00"
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Гоце Делчев",
                "addressCountry": "BG"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Меню",
                "itemListElement": [
                  {
                    "@type": "OfferCatalog",
                    "name": "Гироси",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "MenuItem",
                          "name": "Гирос"
                        }
                      }
                    ]
                  },
                  {
                    "@type": "OfferCatalog",
                    "name": "Бургери",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "MenuItem",
                          "name": "Бургер"
                        }
                      }
                    ]
                  }
                ]
              }
            })
          }}
        />
        <Script
          id="schema-local-business"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": "Molly Food София",
                "image": "https://molly.bg/logo-molly-goce-delchev.jpg",
                "url": "https://molly.bg",
                "telephone": "+359899071718",
                "priceRange": "$$",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "София",
                  "addressCountry": "BG"
                },
                "openingHoursSpecification": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
                  ],
                  "opens": "10:00",
                  "closes": "22:00"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": "Molly Food Благоевград",
                "image": "https://molly.bg/logo-molly-goce-delchev.jpg",
                "url": "https://molly.bg",
                "telephone": "+359893071717",
                "priceRange": "$$",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Благоевград",
                  "addressCountry": "BG"
                },
                "openingHoursSpecification": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
                  ],
                  "opens": "10:00",
                  "closes": "22:00"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": "Molly Food Гоце Делчев",
                "image": "https://molly.bg/logo-molly-goce-delchev.jpg",
                "url": "https://molly.bg",
                "telephone": "+359899 07 1718",
                "priceRange": "$$",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Гоце Делчев",
                  "addressCountry": "BG"
                },
                "openingHoursSpecification": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
                  ],
                  "opens": "10:00",
                  "closes": "22:00"
                },
                "hasOfferCatalog": {
                  "@type": "OfferCatalog",
                  "name": "Доставка на храна",
                  "itemListElement": [
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "Доставка на храна за вкъщи"
                      }
                    }
                  ]
                }
              }
            ])
          }}
        />
      </head>
      <body className={roboto.className}>
        <main className="max-w-4xl mx-auto p-4">
          <ClientLayout>
            {children}
            <footer className="border-t p-8 text-center mt-16">
              <div className="grid md:grid-cols-3 gap-8 text-gray-200">
                <div className="flex flex-col items-center md:items-start">
                  <h3 className="text-lg font-semibold mb-4 text-yellow-400">Molly <span className="text-blue-600">GYROS</span></h3>
                  <p className="text-sm mb-2">Гръцки гироси и бургери</p>
                  <p className="text-sm mb-2">Доставка на храна в Гоце Делчев</p>
                  <p className="text-sm">Работно време: 10:00 - 22:00</p>
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold mb-4 text-yellow-400">Нашите обекти</h3>
                  <p className="text-sm mb-2">София</p>
                  <p className="text-sm">Гоце Делчев</p>
                </div>
                <div className="flex flex-col items-center md:items-end">
                  <h3 className="text-lg font-semibold mb-4 text-yellow-400">Контакти</h3>
                  <a href="tel:00359899071718" className="text-sm mb-2 hover:text-yellow-400 transition-colors">0899071718</a>
                  <a href="viber://chat?number=%2B359899071718" className="text-sm mb-2 hover:text-yellow-400 transition-colors">Viber</a>
                  <a href="https://www.facebook.com/molly.food" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-yellow-400 transition-colors">Facebook</a>
                </div>
              </div>
              <div className="mt-8 text-sm text-gray-400">
                <p>&copy; {new Date().getFullYear()} Molly GYROS. Всички права запазени.</p>
                <div className="mt-2 flex justify-center gap-4">
                  <a href="/menu" className="hover:text-yellow-400 transition-colors">Меню</a>
                  <span>|</span>
                  <a href="/#about" className="hover:text-yellow-400 transition-colors">За нас</a>
                  <span>|</span>
                  <a href="/#contact" className="hover:text-yellow-400 transition-colors">Контакти</a>
                </div>
              </div>
            </footer>
          </ClientLayout>
        </main>
      </body>
    </html>
  )
}
