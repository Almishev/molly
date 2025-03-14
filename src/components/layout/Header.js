'use client';
import {CartContext} from "@/components/AppContext";
import Bars2 from "@/components/icons/Bars2";
import ShoppingCart from "@/components/icons/ShoppingCart";
import {signOut, useSession} from "next-auth/react";
import Link from "next/link";
import {useContext, useState} from "react";

function AuthLinks({status, userName}) {
  if (status === 'authenticated') {
    return (
      <>
        <Link href={'/profile'} className="whitespace-nowrap">
          Здравей, {userName}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="bg-primary rounded-full text-gray-800 hover:text-secondary transition-colors px-8 py-2">
          Изход
        </button>
      </>
    );
  }
  if (status === 'unauthenticated') {
    return (
      <>
        <Link href={'/login'}>Вход</Link>
        <Link href={'/register'} className="bg-primary rounded-full text-gray-800 hover:text-secondary transition-colors px-8 py-2">
          Регистрация
        </Link>
      </>
    );
  }
  return null;
}

export default function Header() {
  const {data: session, status} = useSession();
  const userData = session?.user;
  let userName = userData?.name || userData?.email;
  const {cartProducts} = useContext(CartContext);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (userName && userName.includes(' ')) {
    userName = userName.split(' ')[0];
  }

  return (
    <header>
      <div className="flex items-center md:hidden justify-between">
        <Link className="text-primary font-semibold text-2xl" href={'/'}>
          MOLLY
        </Link>
        <div className="flex gap-8 items-center">
          <Link href={'/cart'} className="relative">
            <ShoppingCart />
            {cartProducts?.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">
                {cartProducts.length}
              </span>
            )}
          </Link>
          <button
            className="p-1 border"
            onClick={() => setMobileNavOpen(prev => !prev)}>
            <Bars2 />
          </button>
        </div>
      </div>
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="md:hidden p-4 bg-[#2d2d2d] rounded-lg mt-2 flex flex-col gap-2 text-center">
          <Link href={'/'} className="font-bold">НАЧАЛО</Link>
          <Link href={'/menu'} className="font-bold">МЕНЮ</Link>
          <Link href={'/#about'} className="font-bold">ЗА НАС</Link>
          <Link href={'/#contact'} className="font-bold">КОНТАКТ</Link>
          <AuthLinks status={status} userName={userName} />
        </div>
      )}
      <div className="hidden md:flex items-center justify-between">
        <nav className="flex items-center gap-8 text-gray-200 font-semibold">
          <Link className="text-primary font-semibold text-2xl" href={'/'}>
            MOLLY
          </Link>
          <Link href={'/'}>НАЧАЛО</Link>
          <Link href={'/menu'}>МЕНЮ</Link>
          <Link href={'/#about'}>ЗА НАС</Link>
          <Link href={'/#contact'}>КОНТАКТ</Link>
        </nav>
        <nav className="flex items-center gap-4 text-gray-200 font-semibold">
          <AuthLinks status={status} userName={userName} />
          <Link href={'/cart'} className="relative">
            <ShoppingCart />
            {cartProducts?.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-primary text-black text-xs py-1 px-1 rounded-full leading-3">
                {cartProducts.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
} 