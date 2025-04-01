export const metadata = {
  title: 'Контакти | Molly Храна за вкъщи град Гоце Делчев',
  description: 'Свържете се с нас за въпроси, предложения или резервации. Намерете телефон за контакт, адреси на ресторанти и работно време на Molly Food в София, Благоевград и Гоце Делчев.',
  keywords: ['контакти', 'молли контакт', 'телефон', 'адрес', 'работно време', 'ресторант', 'доставка храна'],
  alternates: {
    canonical: 'https://molly.bg/contact'
  },
  openGraph: {
    title: 'Контакти | Molly Food',
    description: 'Свържете се с нас - телефони, локации и работно време на ресторанти Molly Food.',
    url: 'https://molly.bg/contact',
    siteName: 'Molly Food',
    images: [
      {
        url: 'https://molly.bg/giros-molly-logo.webp',
        width: 512,
        height: 512,
        alt: 'Molly Food Contact',
      }
    ],
    locale: 'bg_BG',
    type: 'website',
  }
};

export default function ContactLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
} 