import {useEffect, useState} from "react";

export function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/settings')
      .then(response => response.json())
      .then(data => {
        // Преобразуване на масива от настройки в обект за по-лесен достъп
        const settingsObj = {};
        data.forEach(setting => {
          settingsObj[setting.name] = setting.value;
        });
        setSettings(settingsObj);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching settings:', error);
        setLoading(false);
      });
  }, []);
  
  // Функция за получаване на стойност на настройка с възможност за задаване на стойност по подразбиране
  function getSetting(name, defaultValue = null) {
    if (!settings || settings[name] === undefined) {
      return defaultValue;
    }
    return settings[name];
  }
  
  // Функция за получаване на булева стойност на настройка
  function getBooleanSetting(name, defaultValue = false) {
    const value = getSetting(name, defaultValue);
    return value === true || value === 'true';
  }
  
  // Функция за изчисляване на такса за доставка въз основа на сума
  function calculateDeliveryFee(subtotal) {
    const deliveryFee = getSetting('deliveryFee', 1);
    const freeDeliveryThreshold = getSetting('freeDeliveryThreshold', 0);
    
    // Ако сумата е над прага за безплатна доставка и прагът е по-голям от 0
    if (freeDeliveryThreshold > 0 && subtotal >= freeDeliveryThreshold) {
      return 0;
    }
    
    return deliveryFee;
  }
  
  // Функция за проверка дали е в работно време
  function isWithinBusinessHours() {
    const now = new Date();
    const hours = now.getHours();
    const openingHour = getSetting('openingHour', 10);
    const closingHour = getSetting('closingHour', 22);
    
    return hours >= openingHour && hours < closingHour;
  }
  
  // Проверяваме дали доставките са налични от настройките
  const deliveriesEnabled = getBooleanSetting('deliveriesEnabled', true);
  
  // Съобщение което ще показваме когато доставките не са налични
  const deliveryUnavailableMessage = getSetting(
    'deliveryUnavailableMessage', 
    'За момента не работим с доставки. Можете да посетите нашия ресторант и да се насладите на храната на място.'
  );
  
  // Комбинирана проверка за наличност на доставки
  const isDeliveryAvailable = deliveriesEnabled && isWithinBusinessHours();
  
  return {
    settings,
    loading,
    getSetting,
    getBooleanSetting,
    calculateDeliveryFee,
    isDeliveryAvailable,
    deliveryUnavailableMessage,
    isWithinBusinessHours
  };
} 