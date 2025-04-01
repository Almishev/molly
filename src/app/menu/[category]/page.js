import { redirect } from 'next/navigation';


export async function generateMetadata({ params }) {
  const { category } = params;
  
  
  const formattedCategory = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return {
    title: `${formattedCategory} | Нашето меню`,
    description: `Разгледайте нашите ${formattedCategory.toLowerCase()} и поръчайте онлайн с доставка до вашия дом.`,
  };
}


export default function CategoryPage() {
  
  redirect('/menu');
} 