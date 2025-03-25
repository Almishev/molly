import nodemailer from 'nodemailer';
import { cartProductPrice } from '@/components/AppContext';
import { Settings } from '@/models/Settings';

// Debug config info
console.log('Mailer initializing with config:', {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  user: process.env.EMAIL_USER || 'mineralhotelinfo@gmail.com',
  // password masked for security
});

// Telegram bot token от BotFather
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "7610481348:AAG2UcuYMDL_FBz2VvunmFX9y1gMC-17T6k";
// Chat ID на човека, който трябва да получава известия
// TODO: Заменете с вашия реален Telegram Chat ID след тестването
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

// Конфигурация на транспортера за изпращане на имейли
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true за 465, false за други портове
  auth: {
    user: process.env.EMAIL_USER || 'mineralhotelinfo@gmail.com',
    pass: process.env.EMAIL_PASS || 'ylnppaqssnyjftcc',
  },
});

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server connection successful");
  }
});

// Функция за изчисляване на такса за доставка въз основа на настройките
async function calculateDeliveryFee(subtotal) {
  try {
    // Получаване на настройките от базата данни
    const deliveryFeeSetting = await Settings.findOne({ name: 'deliveryFee' });
    const thresholdSetting = await Settings.findOne({ name: 'freeDeliveryThreshold' });
    
    const deliveryFee = deliveryFeeSetting ? deliveryFeeSetting.value : 1;
    const freeDeliveryThreshold = thresholdSetting ? thresholdSetting.value : 0;
    
    // Ако сумата е над прага за безплатна доставка и прагът е по-голям от 0
    if (freeDeliveryThreshold > 0 && subtotal >= freeDeliveryThreshold) {
      return 0;
    }
    
    return deliveryFee;
  } catch (error) {
    console.error('Error calculating delivery fee:', error);
    return 1; // Връщане на стандартна такса за доставка при грешка
  }
}

/**
 * Изпраща съобщение до Telegram бот
 * @param {string} message - Текстът на съобщението
 * @returns {Promise} - Promise с резултата
 */
async function sendTelegramMessage(message) {
  console.log('Preparing to send Telegram message');
  
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn('Telegram bot token not set');
    return { success: false, error: 'Missing Telegram bot token' };
  }

  try {
    // Ако нямаме Chat ID, ще направим тестово извикване към getUpdates
    // за да помогнем на потребителя да намери своя Chat ID
    if (!TELEGRAM_CHAT_ID) {
      console.log('No Chat ID configured. Checking for recent messages to the bot...');
      try {
        const updatesUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`;
        const updatesResponse = await fetch(updatesUrl);
        const updatesData = await updatesResponse.json();
        
        console.log('getUpdates response:', updatesData);
        
        if (updatesData.ok && updatesData.result && updatesData.result.length > 0) {
          // Намерен е chat_id от последното съобщение
          const lastMessage = updatesData.result[updatesData.result.length - 1];
          const detectedChatId = lastMessage.message?.chat?.id;
          
          if (detectedChatId) {
            console.log('Detected Chat ID from recent messages:', detectedChatId);
            console.log('Set this as TELEGRAM_CHAT_ID in your environment variables');
            
            // Пробваме да изпратим съобщение използвайки намерения chat_id
            const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                chat_id: detectedChatId,
                text: `${message}\n\n<i>Забележка: Това е автоматично съобщение, използващо намерения Chat ID. Конфигурирайте TELEGRAM_CHAT_ID=${detectedChatId} в среда.</i>`,
                parse_mode: 'HTML'
              })
            });
            
            const data = await response.json();
            
            if (data.ok) {
              console.log('Telegram message sent successfully with detected Chat ID', {
                message_id: data.result.message_id,
                chat_id: detectedChatId
              });
              return { 
                success: true, 
                messageId: data.result.message_id,
                note: `Използван е автоматично намерен Chat ID: ${detectedChatId}. Моля, добавете TELEGRAM_CHAT_ID=${detectedChatId} в environment variables.`
              };
            }
          }
        }
        
        console.warn('Could not find a Chat ID from recent messages. Please send a message to your Telegram bot and try again.');
        return { 
          success: false, 
          error: 'No Chat ID configured and none could be found from recent messages. Please check the console for more information.' 
        };
        
      } catch (error) {
        console.error('Error checking for Chat ID:', error);
      }
      
      return { success: false, error: 'No Telegram Chat ID configured' };
    }

    // Нормално изпращане на съобщение с конфигуриран Chat ID
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    const data = await response.json();
    
    if (data.ok) {
      console.log('Telegram message sent successfully', {
        message_id: data.result.message_id
      });
      return { success: true, messageId: data.result.message_id };
    } else {
      console.error('Error sending Telegram message:', data);
      return { success: false, error: data.description };
    }
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Изпраща имейл за нова поръчка
 * @param {Object} order - Информация за поръчката
 * @returns {Promise} - Promise с резултата от изпращането
 */
export async function sendOrderNotification(order) {
  console.log('Starting sendOrderNotification with order ID:', order._id);
  try {
    // Debug logging
    console.log('Order data for email:', {
      phone: order.phone,
      streetAddress: order.streetAddress,
      city: order.city,
      notes: order.notes,
      cartProducts: order.cartProducts?.length || 0,
      userEmail: order.userEmail || 'guest'
    });
    
    // Форматиране на продуктите в поръчката
    const productsHtml = order.cartProducts.map(product => {
      const extras = product.extras?.length > 0 
        ? `<br>Екстри: ${product.extras.map(e => e.name).join(', ')}` 
        : '';
      const size = product.size ? `<br>Размер: ${product.size.name}` : '';
      
      return `
        <div style="margin-bottom: 10px; padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${product.name}</strong> x ${product.quantity || 1}
          ${size}
          ${extras}
        </div>
      `;
    }).join('');
    
    // Изчисляване на общата сума
    let subtotal = 0;
    for (const product of order.cartProducts) {
      let productPrice = product.basePrice || 0;
      
      // Add size price if available
      if (product.size && product.size.price) {
        productPrice += product.size.price;
      }
      
      // Add extras prices if available
      if (product.extras && product.extras.length > 0) {
        for (const extra of product.extras) {
          if (extra.price) {
            productPrice += extra.price;
          }
        }
      }
      
      subtotal += productPrice * (product.quantity || 1);
    }
    // Закръгляне до втория знак след десетичната запетая
    subtotal = parseFloat(subtotal.toFixed(2));
    
    // Изчисляване на такса за доставка въз основа на настройките
    const deliveryFee = order.deliveryFee !== undefined ? order.deliveryFee : await calculateDeliveryFee(subtotal);
    const total = parseFloat((subtotal + deliveryFee).toFixed(2));
    
    // Информация за адреса
    const addressInfo = `
      <p><strong>Телефон:</strong> ${order.phone}</p>
      <p><strong>Адрес:</strong> ${order.streetAddress}</p>
      <p><strong>Град:</strong> ${order.city}</p>
      ${order.notes ? `<p><strong>Забележки:</strong> ${order.notes}</p>` : ''}
    `;
    
    // Изпращане на имейла
    console.log('Preparing to send email with data:', {
      from: `"MOLLY Food Ordering" <${process.env.EMAIL_USER || 'mineralhotelinfo@gmail.com'}>`,
      to: 'miroslavsinanov72@gmail.com',
      subject: `Нова поръчка #${order._id}`,
      contentLength: `HTML content length: ${productsHtml.length} characters`,
      subtotal,
      deliveryFee,
      total
    });
    
    const info = await transporter.sendMail({
      from: `"MOLLY Food Ordering" <${process.env.EMAIL_USER || 'mineralhotelinfo@gmail.com'}>`,
      to: 'miroslavsinanov72@gmail.com',
      subject: `Нова поръчка #${order._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4169E1; text-align: center;">Нова поръчка</h2>
          <p style="text-align: center;">Имате нова поръчка от ${order.userEmail || 'гост'}</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Информация за поръчката</h3>
            <p><strong>Номер на поръчка:</strong> ${order._id}</p>
            <p><strong>Дата:</strong> ${order.bulgarianTime || new Date(order.createdAt).toLocaleString('bg-BG')}</p>
            <p><strong>Статус на плащане:</strong> ${order.paid ? 'Платена' : 'Неплатена (плащане при доставка)'}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3>Продукти</h3>
            ${productsHtml}
            
            <div style="text-align: right; margin-top: 15px;">
              <p><strong>Междинна сума:</strong> ${subtotal.toFixed(2)} лв</p>
              <p><strong>Доставка:</strong> ${deliveryFee.toFixed(2)} лв</p>
              ${deliveryFee === 0 ? '<p style="color: green;"><strong>Безплатна доставка!</strong></p>' : ''}
              <p style="font-size: 18px;"><strong>Общо:</strong> ${total.toFixed(2)} лв</p>
            </div>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Информация за доставка</h3>
            ${addressInfo}
          </div>
          
          <p style="text-align: center; margin-top: 30px; color: #777;">
            Това е автоматично генериран имейл. Моля, не отговаряйте на този имейл.
          </p>
        </div>
      `,
    });
    
    // Подготовка на съобщение за Telegram
    const telegramMessage = `
<b>🛍️ Нова поръчка #${order._id}</b>

<b>Информация за поръчката:</b>
📱 <b>Телефон:</b> ${order.phone}
📍 <b>Адрес:</b> ${order.streetAddress}
🏙️ <b>Град:</b> ${order.city}
${order.notes ? `📝 <b>Забележки:</b> ${order.notes}` : ''}

<b>Продукти (${order.cartProducts.length}):</b>
${order.cartProducts.map(product => {
  const extras = product.extras?.length > 0 
    ? ` + Екстри: ${product.extras.map(e => e.name).join(', ')}` 
    : '';
  const size = product.size ? ` (${product.size.name})` : '';
  
  return `- ${product.name}${size} x ${product.quantity || 1}${extras}`;
}).join('\n')}

<b>Плащане:</b>
💰 <b>Сума:</b> ${subtotal.toFixed(2)} лв
🚚 <b>Доставка:</b> ${deliveryFee.toFixed(2)} лв
${deliveryFee === 0 ? '🎉 <b>Безплатна доставка!</b>' : ''}
💵 <b>Общо:</b> ${total.toFixed(2)} лв
💳 <b>Статус:</b> ${order.paid ? 'Платена' : 'Плащане при доставка'}
    `;
    
    // Изпращане на съобщение в Telegram
    await sendTelegramMessage(telegramMessage);
    
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    });
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending order notifications:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      stack: error.stack
    });
    return { success: false, error: error.message };
  }
}

/**
 * Изпраща тестов имейл и Telegram съобщение за проверка на конфигурацията
 * @returns {Promise} - Promise с резултата от изпращането
 */
export async function sendTestEmail() {
  console.log('Starting sendTestEmail function');
  
  const results = {
    email: null,
    telegram: null
  };
  
  try {
    console.log('Preparing to send test email to: miroslavsinanov72@gmail.com');
    
    const info = await transporter.sendMail({
      from: `"MOLLY Food Ordering" <${process.env.EMAIL_USER || 'mineralhotelinfo@gmail.com'}>`,
      to: 'miroslavsinanov72@gmail.com',
      subject: 'Тестов имейл от MOLLY Food Ordering',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
          <h2 style="color: #4169E1;">Тестов имейл</h2>
          <p>Това е тестов имейл от системата за поръчки MOLLY Food Ordering.</p>
          <p>Ако получавате този имейл, значи конфигурацията за изпращане на имейли работи правилно.</p>
          <p style="margin-top: 30px; color: #777;">
            Това е автоматично генериран имейл. Моля, не отговаряйте на този имейл.
          </p>
        </div>
      `,
    });
    
    console.log('Test email sent successfully:', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    });
    
    results.email = { success: true, messageId: info.messageId };
    
    // Изпращане на тестово съобщение в Telegram
    const telegramResult = await sendTelegramMessage(`
<b>🧪 Тестово съобщение от MOLLY Food Ordering</b>

Това е тестово съобщение от системата за поръчки MOLLY Food.
Ако получавате това съобщение, значи конфигурацията за Telegram известия работи правилно.
    `);
    
    results.telegram = telegramResult;
    
    return { success: true, results };
  } catch (error) {
    console.error('Error sending test notifications:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      stack: error.stack
    });
    
    return { success: false, error: error.message, results };
  }
} 