import { redirect } from 'next/navigation';

// Това е сървърен компонент, който генерира метаданни
export async function generateMetadata({ params }) {
  const { category } = params;
  
  // Форматираме името на категорията за по-добро показване
  const formattedCategory = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return {
    title: `${formattedCategory} | Нашето меню`,
    description: `Разгледайте нашите ${formattedCategory.toLowerCase()} и поръчайте онлайн с доставка до вашия дом.`,
  };
}

// Това е основният компонент на страницата
export default function CategoryPage() {
  // Пренасочваме към основната страница на менюто
  redirect('/menu');
} 