'use client';
import {useProfile} from "@/components/UseProfile";
import UserTabs from "@/components/layout/UserTabs";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const {loading, data} = useProfile();
  const [deliveryFee, setDeliveryFee] = useState('');
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState('');
  const [deliveriesEnabled, setDeliveriesEnabled] = useState(true);
  const [deliveryUnavailableMessage, setDeliveryUnavailableMessage] = useState('');
  const [openingHour, setOpeningHour] = useState('10');
  const [closingHour, setClosingHour] = useState('22');
  const [isSaving, setIsSaving] = useState(false);
  
  // Зареждане на настройките при зареждане на страницата
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(settings => {
        const deliveryFeeSetting = settings.find(s => s.name === 'deliveryFee');
        const thresholdSetting = settings.find(s => s.name === 'freeDeliveryThreshold');
        const deliveriesEnabledSetting = settings.find(s => s.name === 'deliveriesEnabled');
        const unavailableMessageSetting = settings.find(s => s.name === 'deliveryUnavailableMessage');
        const openingHourSetting = settings.find(s => s.name === 'openingHour');
        const closingHourSetting = settings.find(s => s.name === 'closingHour');
        
        if (deliveryFeeSetting) {
          setDeliveryFee(deliveryFeeSetting.value.toString());
        }
        
        if (thresholdSetting) {
          setFreeDeliveryThreshold(thresholdSetting.value.toString());
        }
        
        if (deliveriesEnabledSetting !== undefined) {
          setDeliveriesEnabled(!!deliveriesEnabledSetting.value);
        }
        
        if (unavailableMessageSetting) {
          setDeliveryUnavailableMessage(unavailableMessageSetting.value);
        } else {
          setDeliveryUnavailableMessage('За момента не работим с доставки. Можете да посетите нашия ресторант и да се насладите на храната на място.');
        }
        
        if (openingHourSetting) {
          setOpeningHour(openingHourSetting.value.toString());
        }
        
        if (closingHourSetting) {
          setClosingHour(closingHourSetting.value.toString());
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
    const openingHourValue = parseInt(openingHour);
    const closingHourValue = parseInt(closingHour);
    
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
    
    if (isNaN(openingHourValue) || openingHourValue < 0 || openingHourValue > 23) {
      toast.error('Моля, въведете валиден час за отваряне (0-23)');
      setIsSaving(false);
      return;
    }
    
    if (isNaN(closingHourValue) || closingHourValue < 0 || closingHourValue > 23) {
      toast.error('Моля, въведете валиден час за затваряне (0-23)');
      setIsSaving(false);
      return;
    }
    
    if (!deliveryUnavailableMessage) {
      toast.error('Моля, въведете съобщение за недостъпни доставки');
      setIsSaving(false);
      return;
    }
    
    const settingsToSave = [
      {
        name: 'deliveryFee',
        value: deliveryFeeValue,
        description: 'Такса за доставка в лева'
      },
      {
        name: 'freeDeliveryThreshold',
        value: thresholdValue,
        description: 'Праг за безплатна доставка в лева'
      },
      {
        name: 'deliveriesEnabled',
        value: deliveriesEnabled,
        description: 'Дали доставките са разрешени'
      },
      {
        name: 'deliveryUnavailableMessage',
        value: deliveryUnavailableMessage,
        description: 'Съобщение при недостъпни доставки'
      },
      {
        name: 'openingHour',
        value: openingHourValue,
        description: 'Час на отваряне (0-23)'
      },
      {
        name: 'closingHour',
        value: closingHourValue,
        description: 'Час на затваряне (0-23)'
      }
    ];
    
    try {
      // Изпращане на всички настройки последователно
      for (const setting of settingsToSave) {
        await fetch('/api/settings', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(setting)
        });
      }
      
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
          {/* Секция с настройки за работно време */}
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <h3 className="text-white text-xl mb-2">Наличност на доставки</h3>
            
            <div className="mb-4">
              <label className="text-gray-300 inline-flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={deliveriesEnabled}
                  onChange={e => setDeliveriesEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <span>Разреши доставки</span>
              </label>
              <p className="text-gray-400 text-sm mt-1">
                Изключете това, ако колата за доставки е в ремонт или не желаете да приемате поръчки за доставка.
              </p>
            </div>
            
            <div className="mb-4">
              <label className="text-gray-300">Съобщение при недостъпни доставки</label>
              <textarea
                value={deliveryUnavailableMessage}
                onChange={ev => setDeliveryUnavailableMessage(ev.target.value)}
                placeholder="За момента не работим с доставки..."
                rows={3}
                required
              />
              <p className="text-gray-400 text-sm mt-1">
                Това съобщение ще се показва, когато доставките са недостъпни.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="text-gray-300">Час на отваряне</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={openingHour}
                  onChange={ev => setOpeningHour(ev.target.value)}
                  required
                />
                <p className="text-gray-400 text-sm mt-1">
                  Час, в който започват доставките (0-23)
                </p>
              </div>
              
              <div className="mb-4">
                <label className="text-gray-300">Час на затваряне</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={closingHour}
                  onChange={ev => setClosingHour(ev.target.value)}
                  required
                />
                <p className="text-gray-400 text-sm mt-1">
                  Час, в който приключват доставките (0-23)
                </p>
              </div>
            </div>
          </div>
          
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