'use client';
import { useEffect, useState } from 'react';
import CategorySection from '@/components/menu/CategorySection';

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(0); // Default to first category
  const [loading, setLoading] = useState(true);
  const [categoryItemsMap, setCategoryItemsMap] = useState({});

  useEffect(() => {
    // Fetch categories and menu items
    Promise.all([
      fetch('/api/categories').then(res => res.json()),
      fetch('/api/menu-items').then(res => res.json())
    ])
      .then(([categoriesData, menuItemsData]) => {
        // Categories are already sorted by the API based on the order field
        setCategories(categoriesData);
        setMenuItems(menuItemsData);
        
        // Create a map of category ID to menu items
        const itemsMap = {};
        categoriesData.forEach(category => {
          itemsMap[category._id] = menuItemsData.filter(item => item.category === category._id);
        });
        setCategoryItemsMap(itemsMap);
        
        // Set the first category as expanded by default if categories exist
        if (categoriesData.length > 0) {
          setExpandedIndex(0);
        }
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  // Toggle category expansion by index
  const toggleCategory = (index) => {
    setExpandedIndex(prevIndex => prevIndex === index ? null : index);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Нашето меню</h1>
      
      {categories.length > 0 ? (
        <div className="space-y-6">
          {categories.map((category, index) => {
            const categoryItems = categoryItemsMap[category._id] || [];
            return (
              <CategorySection
                key={category._id}
                category={category}
                menuItems={categoryItems}
                isExpanded={expandedIndex === index}
                toggleExpand={() => toggleCategory(index)}
                index={index}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          Няма налични категории
        </div>
      )}
    </div>
  );
}