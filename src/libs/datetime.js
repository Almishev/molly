export function dbTimeForHuman(str) {
  if (!str) return '';
  
 
  const date = new Date(str);
  const bulgarianTime = new Date(date.getTime());
  

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