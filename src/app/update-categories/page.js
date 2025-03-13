'use client';
import { useEffect, useState } from 'react';
import { useProfile } from '@/components/UseProfile';
import UserTabs from '@/components/layout/UserTabs';

export default function UpdateCategoriesPage() {
  const { loading, data: profile } = useProfile();
  const [message, setMessage] = useState('');
  const [updating, setUpdating] = useState(false);

  async function updateCategoryOrder() {
    setUpdating(true);
    setMessage('Updating category orders...');
    
    try {
      const response = await fetch('/api/update-category-order');
      const data = await response.json();
      
      if (data.success) {
        setMessage('Category orders updated successfully! Please refresh the menu page.');
      } else {
        setMessage('Error: ' + data.message);
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return <div>Loading user info...</div>;
  }

  if (!profile?.admin) {
    return <div>Not authorized</div>;
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={true} />
      
      <div className="mt-8 bg-[#2d2d2d] p-4 rounded-lg">
        <h1 className="text-xl font-bold mb-4">Update Category Order</h1>
        <p className="mb-4">
          This will update the order of categories to match the following sequence:
        </p>
        <ol className="list-decimal pl-6 mb-4">
          <li>Гироси</li>
          <li>Бургери</li>
          <li>Порции</li>
          <li>Салати</li>
          <li>Десерти</li>
          <li>Напитки</li>
        </ol>
        
        <button 
          onClick={updateCategoryOrder}
          disabled={updating}
          className="bg-yellow-500 text-black py-2 px-4 rounded-full hover:bg-yellow-400 transition-colors disabled:opacity-50"
        >
          {updating ? 'Updating...' : 'Update Category Order'}
        </button>
        
        {message && (
          <div className="mt-4 p-2 bg-gray-800 rounded-lg">
            {message}
          </div>
        )}
      </div>
    </section>
  );
} 