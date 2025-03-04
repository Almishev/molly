export function dbTimeForHuman(str) {
  if (!str) return '';
  
  // Конвертиране към българска времева зона (UTC+2 или UTC+3 в зависимост от лятно/зимно време)
  const date = new Date(str);
  const bulgarianTime = new Date(date.getTime());
  
  // Форматиране на датата
  const options = { 
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Sofia'
  };
  
  return new Intl.DateTimeFormat('bg-BG', options).format(bulgarianTime);
}

// Функция за получаване на текущата дата и час в българска времева зона
export function getCurrentBulgarianTime() {
  const now = new Date();
  const options = { 
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: false,
    timeZone: 'Europe/Sofia'
  };
  
  return new Intl.DateTimeFormat('bg-BG', options).format(now);
}