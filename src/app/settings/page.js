'use client';
import {useProfile} from "@/components/UseProfile";
import UserTabs from "@/components/layout/UserTabs";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const {loading, data} = useProfile();
  const [deliveryFee, setDeliveryFee] = useState('');
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Зареждане на настройките при зареждане на страницата
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(settings => {
        const deliveryFeeSetting = settings.find(s => s.name === 'deliveryFee');
        const thresholdSetting = settings.find(s => s.name === 'freeDeliveryThreshold');
        
        if (deliveryFeeSetting) {
          setDeliveryFee(deliveryFeeSetting.value.toString());
        }
        
        if (thresholdSetting) {
          setFreeDeliveryThreshold(thresholdSetting.value.toString());
        }
      });
  }, []);
  
  // Запазване на настройките
  async function handleSaveSettings(ev) {
    ev.preventDefault();
    setIsSaving(true);
    
    // Валидация на въведените стойности
    const deliveryFeeValue = parseFloat(deliveryFee);
    const thresholdValue = parseFloat(freeDeliveryThreshold);
    
    if (isNaN(deliveryFeeValue) || deliveryFeeValue < 0) {
      toast.error('Моля, въведете валидна такса за доставка');
      setIsSaving(false);
      return;
    }
    
    if (isNaN(thresholdValue) || thresholdValue < 0) {
      toast.error('Моля, въведете валиден праг за безплатна доставка');
      setIsSaving(false);
      return;
    }
    
    // Запазване на настройката за такса за доставка
    const deliveryFeePromise = fetch('/api/settings', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: 'deliveryFee',
        value: deliveryFeeValue,
        description: 'Такса за доставка в лева'
      })
    });
    
    // Запазване на настройката за праг за безплатна доставка
    const thresholdPromise = fetch('/api/settings', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: 'freeDeliveryThreshold',
        value: thresholdValue,
        description: 'Праг за безплатна доставка в лева'
      })
    });
    
    // Изчакване на двете заявки
    try {
      await Promise.all([deliveryFeePromise, thresholdPromise]);
      toast.success('Настройките са запазени успешно');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Възникна грешка при запазване на настройките');
    } finally {
      setIsSaving(false);
    }
  }
  
  if (loading) {
    return 'Зареждане...';
  }
  
  if (!data.admin) {
    return 'Нямате достъп до тази страница';
  }
  
  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={true} />
      
      <div className="mt-8">
        <h2 className="text-center text-primary text-4xl mb-4">Настройки на приложението</h2>
        
        <form onSubmit={handleSaveSettings}>
          <div className="bg-black p-4 rounded-lg mb-4">
            <h3 className="text-white text-xl mb-2">Настройки за доставка</h3>
            
            <div className="mb-4">
              <label className="text-gray-300">Такса за доставка (лв)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={deliveryFee}
                onChange={ev => setDeliveryFee(ev.target.value)}
                placeholder="Например: 1.00"
                required
              />
              <p className="text-gray-400 text-sm mt-1">
                Стандартната такса за доставка, която ще бъде добавена към всяка поръчка.
              </p>
            </div>
            
            <div className="mb-4">
              <label className="text-gray-300">Праг за безплатна доставка (лв)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={freeDeliveryThreshold}
                onChange={ev => setFreeDeliveryThreshold(ev.target.value)}
                placeholder="Например: 30.00"
                required
              />
              <p className="text-gray-400 text-sm mt-1">
                Сума на поръчката, над която доставката ще бъде безплатна. Въведете 0, за да деактивирате безплатната доставка.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <button
              type="submit"
              className="bg-primary text-black px-8 py-2 rounded-full"
              disabled={isSaving}
            >
              {isSaving ? 'Запазване...' : 'Запази настройките'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
} 