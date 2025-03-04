'use client';
import Link from "next/link";
import {usePathname} from "next/navigation";

export default function UserTabs({isAdmin}) {
  const path = usePathname();
  return (
    <div className="flex mx-auto gap-2 tabs justify-center flex-wrap">
      <Link
        className={path === '/profile' ? 'active' : ''}
        href={'/profile'}
      >
        Профил
      </Link>
      {isAdmin && (
        <>
          <Link
            href={'/categories'}
            className={path === '/categories' ? 'active' : ''}
          >
            Категории
          </Link>
          <Link
            href={'/menu-items'}
            className={path.includes('menu-items') ? 'active' : ''}
          >
            Артикули
          </Link>
          <Link
            className={path.includes('/users') ? 'active' : ''}
            href={'/users'}
          >
            Потребители
          </Link>
        </>
      )}
      <Link
        className={path === '/orders' ? 'active' : ''}
        href={'/orders'}
      >
        {isAdmin ? 'Поръчки' : 'Чакащи поръчки'}
      </Link>
    </div>
  );
}