import { useRouter } from 'next/navigation';

export default function CategoryNavigation({ categories, activeCategory, setActiveCategory }) {
  const router = useRouter();
  
  const handleCategoryClick = (categoryName) => {
    console.log("Кликнато на категория:", categoryName);
    setActiveCategory(categoryName);
    
    router.push(`/menu/${categoryName}`, { scroll: false });
  };
  
  return (
    <div className="sticky top-0 z-10 bg-[#1e1e1e] py-4 shadow-md">
      <div className="container mx-auto flex justify-center flex-wrap gap-2 px-4">
        {categories.map(category => {
          const categoryKey = category.name.toLowerCase().replace(/\s+/g, '-');
          const isActive = activeCategory === categoryKey;
          
          return (
            <button 
              key={category._id} 
              onClick={() => handleCategoryClick(categoryKey)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                isActive 
                  ? 'bg-yellow-500 text-black font-semibold shadow-md' 
                  : 'bg-[#2d2d2d] text-white hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
} 