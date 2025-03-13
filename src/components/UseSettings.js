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
    if (!settings || !settings[name]) {
      return defaultValue;
    }
    return settings[name];
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
  
  return {
    settings,
    loading,
    getSetting,
    calculateDeliveryFee
  };
} 