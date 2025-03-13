'use client';
import DeleteButton from "@/components/DeleteButton";
import UserTabs from "@/components/layout/UserTabs";
import {useEffect, useState} from "react";
import {useProfile} from "@/components/UseProfile";
import toast from "react-hot-toast";

export default function CategoriesPage() {

  const [categoryName, setCategoryName] = useState('');
  const [categoryOrder, setCategoryOrder] = useState(0);
  const [categories, setCategories] = useState([]);
  const {loading:profileLoading, data:profileData} = useProfile();
  const [editedCategory, setEditedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    fetch('/api/categories').then(res => {
      res.json().then(categories => {
        setCategories(categories);
      });
    });
  }

  async function handleCategorySubmit(ev) {
    ev.preventDefault();
    const creationPromise = new Promise(async (resolve, reject) => {
      const data = {
        name: categoryName,
        order: categoryOrder,
      };
      if (editedCategory) {
        data._id = editedCategory._id;
      }
      const response = await fetch('/api/categories', {
        method: editedCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setCategoryName('');
      setCategoryOrder(0);
      fetchCategories();
      setEditedCategory(null);
      if (response.ok)
        resolve();
      else
        reject();
    });
    await toast.promise(creationPromise, {
      loading: editedCategory
                 ? 'Updating category...'
                 : 'Creating your new category...',
      success: editedCategory ? 'Category updated' : 'Category created',
      error: 'Error, sorry...',
    });
  }

  async function handleDeleteClick(_id) {
    const promise = new Promise(async (resolve, reject) => {
      const response = await fetch('/api/categories?_id='+_id, {
        method: 'DELETE',
      });
      if (response.ok) {
        resolve();
      } else {
        reject();
      }
    });

    await toast.promise(promise, {
      loading: 'Deleting...',
      success: 'Deleted',
      error: 'Error',
    });

    fetchCategories();
  }

  if (profileLoading) {
    return 'Loading user info...';
  }

  if (!profileData.admin) {
    return 'Not an admin';
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={true} />
      <form className="mt-8" onSubmit={handleCategorySubmit}>
        <div className="flex gap-2 items-end">
          <div className="grow">
            <label>
              {editedCategory ? 'Промени категория' : 'Създай нова категория'}
              {editedCategory && (
                <>: <b>{editedCategory.name}</b></>
              )}
            </label>
            <input type="text"
                   value={categoryName}
                   onChange={ev => setCategoryName(ev.target.value)}
                   placeholder="Име на категория"
            />
          </div>
          <div className="w-24">
            <label>Ред</label>
            <input type="number"
                   value={categoryOrder}
                   onChange={ev => setCategoryOrder(Number(ev.target.value))}
                   placeholder="Ред"
            />
          </div>
          <div className="pb-2 flex gap-2">
            <button className="border border-primary" type="submit">
              {editedCategory ? 'Запази' : 'Създай'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setCategoryName('');
                setCategoryOrder(0);
              }}>
              Изход
            </button>
          </div>
        </div>
      </form>
      <div>
        <h2 className="mt-8 text-sm text-gray-200">Съществуващи категории</h2>
        <div className="text-sm text-gray-400 mb-2">
          Категориите се показват в реда на тяхното число в полето &quot;Ред&quot; (от най-малкото към най-голямото).
          <br />
          Препоръчителен ред: 1-Гироси, 2-Бургери, 3-Порции, 4-Салати, 5-Десерти, 6-Напитки
        </div>
        {categories?.length > 0 && categories.map(c => (
          <div
            key={c._id}
            className="bg-[#2d2d2d] rounded-xl p-2 px-4 flex gap-1 mb-1 items-center">
            <div className="grow text-gray-100">
              {c.name}
            </div>
            <div className="text-gray-400 mr-4">
              Ред: {c.order || 0}
            </div>
            <div className="flex gap-1">
              <button type="button"
                      onClick={() => {
                        setEditedCategory(c);
                        setCategoryName(c.name);
                        setCategoryOrder(c.order || 0);
                      }}
              >
                Редактирай
              </button>
              <DeleteButton
                label="Изтрий"
                onDelete={() => handleDeleteClick(c._id)} />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <a href="/update-categories" className="bg-yellow-500 text-black py-2 px-4 rounded-full hover:bg-yellow-400 transition-colors inline-block">
          Обнови реда на категориите
        </a>
      </div>
    </section>
  );
}