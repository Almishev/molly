import {useEffect, useState} from "react";

export function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/settings')
      .then(response => response.json())
      .then(data => {
        
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
  
  
  function getSetting(name, defaultValue = null) {
    if (!settings || settings[name] === undefined) {
      return defaultValue;
    }
    return settings[name];
  }
  
  
  function getBooleanSetting(name, defaultValue = false) {
    const value = getSetting(name, defaultValue);
    return value === true || value === 'true';
  }
  
 
  function calculateDeliveryFee(subtotal) {
    const deliveryFee = getSetting('deliveryFee', 1);
    const freeDeliveryThreshold = getSetting('freeDeliveryThreshold', 0);
    
   
    if (freeDeliveryThreshold > 0 && subtotal >= freeDeliveryThreshold) {
      return 0;
    }
    
    return deliveryFee;
  }
  
  
  function isWithinBusinessHours() {
    const now = new Date();
    const hours = now.getHours();
    const openingHour = getSetting('openingHour', 10);
    const closingHour = getSetting('closingHour', 22);
    
    return hours >= openingHour && hours < closingHour;
  }
  
  
  const deliveriesEnabled = getBooleanSetting('deliveriesEnabled', true);
  
  
  const deliveryUnavailableMessage = getSetting(
    'deliveryUnavailableMessage', 
    'За момента не работим с доставки. Можете да посетите нашия ресторант и да се насладите на храната на място.'
  );
  
 
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