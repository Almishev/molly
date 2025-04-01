import { useRef, useEffect } from 'react';
import MenuItem from './MenuItem';

export default function CategorySection({ 
  category, 
  menuItems, 
  isExpanded, 
  toggleExpand,
  index
}) {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const categoryKey = category.name.toLowerCase().replace(/\s+/g, '-');
  

  useEffect(() => {
    if (isExpanded && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isExpanded]);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleExpand();
  };
  
  return (
    <section 
      id={categoryKey} 
      ref={sectionRef}
      className="mb-8 category-section"
    >
      <div 
        className="category-header"
        onClick={handleClick}
      >
        <h2>{category.name}</h2>
        <span 
          className="category-toggle-button"
          style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
        >
          ▼
        </span>
      </div>
      
      <div 
        ref={contentRef}
        className={`category-content ${isExpanded ? 'expanded' : ''}`}
        style={{
          maxHeight: isExpanded ? '5000px' : '0',
          transition: 'max-height 0.5s ease-in-out',
          overflow: 'hidden'
        }}
      >
        {menuItems && menuItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {menuItems.map(item => (
              <MenuItem 
                key={item._id} 
                {...item}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            Няма продукти в тази категория
          </div>
        )}
      </div>
    </section>
  );
} 