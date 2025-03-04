'use client';
import UserForm from "@/components/layout/UserForm";
import UserTabs from "@/components/layout/UserTabs";
import {useProfile} from "@/components/UseProfile";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";

export default function EditUserPage() {
  const {loading, data} = useProfile();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {id} = useParams();

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/profile?_id='+id)
      .then(res => {
        if (!res.ok) {
          throw new Error('Грешка при зареждане на потребителя');
        }
        return res.json();
      })
      .then(userData => {
        if (!userData) {
          throw new Error('Потребителят не е намерен');
        }
        setUser(userData);
      })
      .catch(err => {
        toast.error(err.message);
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  async function handleSaveButtonClick(ev, data) {
    ev.preventDefault();
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await fetch('/api/profile', {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({...data,_id:id}),
        });
        if (res.ok) {
          resolve();
        } else {
          const errorData = await res.json();
          reject(errorData.error || 'Грешка при запазване');
        }
      } catch (error) {
        reject(error.message || 'Възникна грешка');
      }
    });

    await toast.promise(promise, {
      loading: 'Запазване...',
      success: 'Потребителят е запазен!',
      error: 'Грешка при запазване',
    });
  }

  if (loading || isLoading) {
    return (
      <section className="mt-8 max-w-2xl mx-auto">
        <UserTabs isAdmin={true} />
        <div className="mt-8">
          <div className="text-center">
            Зареждане...
          </div>
        </div>
      </section>
    );
  }

  if (!data.admin) {
    return 'Not an admin';
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={true} />
      <div className="mt-8">
        {user ? (
          <UserForm user={user} onSave={handleSaveButtonClick} />
        ) : (
          <div className="text-center text-red-500">
            Потребителят не е намерен
          </div>
        )}
      </div>
    </section>
  );
}