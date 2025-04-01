import nodemailer from 'nodemailer';
import { cartProductPrice } from '@/components/AppContext';
import { Settings } from '@/models/Settings';


console.log('Mailer initializing with config:', {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  user: process.env.EMAIL_USER || 'mineralhotelinfo@gmail.com',
  
});


const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "7610481348:AAG2UcuYMDL_FBz2VvunmFX9y1gMC-17T6k";

const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";


const isVercel = process.env.VERCEL === '1';
console.log('Running on Vercel:', isVercel);


async function safeFetch(url, options) {
  try {
    
    return await fetch(url, options);
  } catch (error) {
    console.error('Standard fetch failed, error:', error);
    
    try {
     
      const https = await import('https');
      
      return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const reqOptions = {
          hostname: urlObj.hostname,
          path: urlObj.pathname + urlObj.search,
          method: options.method || 'GET',
          headers: options.headers || {},
        };
        
        const req = https.request(reqOptions, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          
          res.on('end', () => {
            resolve({
              ok: res.statusCode >= 200 && res.statusCode < 300,
              status: res.statusCode,
              statusText: res.statusMessage,
              json: () => Promise.resolve(JSON.parse(data)),
              text: () => Promise.resolve(data)
            });
          });
        });
        
        req.on('error', (e) => {
          reject(e);
        });
        
        if (options.body) {
          req.write(options.body);
        }
        
        req.end();
      });
    } catch (httpError) {
      console.error('Alternative HTTP request also failed:', httpError);
      throw error; 
    }
  }
}


const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER || 'mineralhotelinfo@gmail.com',
    pass: process.env.EMAIL_PASS || 'ylnppaqssnyjftcc',
  },
});


transporter.verify(function(error, success) {
  if (error) {
    console.log("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server connection successful");
  }
});


async function calculateDeliveryFee(subtotal) {
  try {
    
    const deliveryFeeSetting = await Settings.findOne({ name: 'deliveryFee' });
    const thresholdSetting = await Settings.findOne({ name: 'freeDeliveryThreshold' });
    
    const deliveryFee = deliveryFeeSetting ? deliveryFeeSetting.value : 1;
    const freeDeliveryThreshold = thresholdSetting ? thresholdSetting.value : 0;
    
   
    if (freeDeliveryThreshold > 0 && subtotal >= freeDeliveryThreshold) {
      return 0;
    }
    
    return deliveryFee;
  } catch (error) {
    console.error('Error calculating delivery fee:', error);
    return 1; 
  }
}

/**
 * Изпраща съобщение до Telegram бот
 * @param {string} message - Текстът на съобщението
 * @returns {Promise} - Promise с резултата
 */
async function sendTelegramMessage(message) {
  console.log('Preparing to send Telegram message');
  console.log('TELEGRAM_BOT_TOKEN available:', !!TELEGRAM_BOT_TOKEN);
  console.log('TELEGRAM_CHAT_ID available:', !!TELEGRAM_CHAT_ID);
  console.log('Environment:', {
    TELEGRAM_BOT_TOKEN: TELEGRAM_BOT_TOKEN.substring(0, 10) + '...',
    TELEGRAM_CHAT_ID,
    isVercel
  });
  
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn('Telegram bot token not set');
    return { success: false, error: 'Missing Telegram bot token' };
  }

  try {
   
    if (!TELEGRAM_CHAT_ID) {
      console.log('No Chat ID configured. Checking for recent messages to the bot...');
      try {
        const updatesUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`;
        const updatesResponse = await safeFetch(updatesUrl);
        const updatesData = await updatesResponse.json();
        
        console.log('getUpdates response:', updatesData);
        
        if (updatesData.ok && updatesData.result && updatesData.result.length > 0) {
         
          const lastMessage = updatesData.result[updatesData.result.length - 1];
          const detectedChatId = lastMessage.message?.chat?.id;
          
          if (detectedChatId) {
            console.log('Detected Chat ID from recent messages:', detectedChatId);
            console.log('Set this as TELEGRAM_CHAT_ID in your environment variables');
            
            
            const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
            const response = await safeFetch(url, {
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

    
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    console.log('Sending to Telegram API:', { 
      url: url.substring(0, 50) + '...',
      chat_id: TELEGRAM_CHAT_ID, 
      messageLength: message.length 
    });
    
    try {
      const postData = JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      });
      
      console.log('Request body length:', postData.length);
      
      const response = await safeFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: postData
      });
      
      if (!response.ok) {
        const text = await response.text();
        console.error('Telegram API response not OK:', { status: response.status, statusText: response.statusText, text });
        return { success: false, error: `HTTP error: ${response.status} ${response.statusText}` };
      }
      
      const data = await response.json();
      
      console.log('Telegram API response:', data);
      
      if (data.ok) {
        console.log('Telegram message sent successfully', {
          message_id: data.result.message_id
        });
        return { success: true, messageId: data.result.message_id };
      } else {
        console.error('Error sending Telegram message:', data);
        return { success: false, error: data.description };
      }
    } catch (fetchError) {
      console.error('Fetch error when sending to Telegram:', fetchError);
      return { success: false, error: `Fetch error: ${fetchError.message}` };
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
  
    console.log('Order data for email:', {
      phone: order.phone,
      streetAddress: order.streetAddress,
      city: order.city,
      notes: order.notes,
      cartProducts: order.cartProducts?.length || 0,
      userEmail: order.userEmail || 'guest'
    });
    
    
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
    
    
    let subtotal = 0;
    for (const product of order.cartProducts) {
      let productPrice = product.basePrice || 0;
      
      
      if (product.size && product.size.price) {
        productPrice += product.size.price;
      }
      
      
      if (product.extras && product.extras.length > 0) {
        for (const extra of product.extras) {
          if (extra.price) {
            productPrice += extra.price;
          }
        }
      }
      
      subtotal += productPrice * (product.quantity || 1);
    }
   
    subtotal = parseFloat(subtotal.toFixed(2));
    
    
    const deliveryFee = order.deliveryFee !== undefined ? order.deliveryFee : await calculateDeliveryFee(subtotal);
    const total = parseFloat((subtotal + deliveryFee).toFixed(2));
    
    
    const addressInfo = `
      <p><strong>Телефон:</strong> ${order.phone}</p>
      <p><strong>Адрес:</strong> ${order.streetAddress}</p>
      <p><strong>Град:</strong> ${order.city}</p>
      ${order.notes ? `<p><strong>Забележки:</strong> ${order.notes}</p>` : ''}
    `;
    
   
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