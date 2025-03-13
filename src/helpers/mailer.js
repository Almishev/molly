import nodemailer from 'nodemailer';
import { cartProductPrice } from '@/components/AppContext';
import { Settings } from '@/models/Settings';

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
 * Изпраща имейл за нова поръчка
 * @param {Object} order - Информация за поръчката
 * @returns {Promise} - Promise с резултата от изпращането
 */
export async function sendOrderNotification(order) {
  try {
    // Debug logging
    console.log('Order data for email:', {
      phone: order.phone,
      streetAddress: order.streetAddress,
      city: order.city,
      notes: order.notes
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
    const info = await transporter.sendMail({
      from: `"MOLLY Food Ordering" <${process.env.EMAIL_USER || 'mineralhotelinfo@gmail.com'}>`,
      to: 'antonalmishev123@gmail.com',
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
    
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Изпраща тестов имейл за проверка на конфигурацията
 * @returns {Promise} - Promise с резултата от изпращането
 */
export async function sendTestEmail() {
  try {
    const info = await transporter.sendMail({
      from: `"MOLLY Food Ordering" <${process.env.EMAIL_USER || 'mineralhotelinfo@gmail.com'}>`,
      to: 'antonalmishev123@gmail.com',
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
    
    console.log('Test email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending test email:', error);
    return { success: false, error: error.message };
  }
} 