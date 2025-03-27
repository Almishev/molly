import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Страницата не е намерена | Molly Food Ordering',
  description: 'Съжаляваме, но страницата, която търсите, не съществува.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="mb-8 relative w-48 h-48">
        <Image
          src="/logo-molly-giros.png"
          alt="Дюнери град Гоце Делчев"
          fill
          sizes="(max-width: 768px) 100vw, 192px"
          className="object-contain"
          priority
        />
      </div>
      
      <h1 className="text-4xl md:text-6xl font-bold text-red-500 mb-4">Molly - 404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-4">Страницата не е намерена</h2>
      
      <p className="text-gray-200 max-w-md mb-8">
        Съжаляваме, но страницата, която търсите, не съществува или е преместена.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/"
          className="bg-blue-500 hover:bg-yellow-500 hover:text-black text-white py-2 px-6 rounded-full transition-all duration-300"
        >
          Начална страница
        </Link>
        
        <Link 
          href="/menu"
          className="bg-blue-500 hover:bg-yellow-500 hover:text-black text-white py-2 px-6 rounded-full transition-all duration-300"
        >
          Към менюто
        </Link>
      </div>
    </div>
  );
} 