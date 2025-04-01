import {authOptions, isAdmin} from "@/app/api/auth/[...nextauth]/route";
import {Order} from "@/models/Order";
import {Settings} from "@/models/Settings";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";
import { sendOrderNotification } from "@/helpers/mailer";

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

export async function GET(req) {
  mongoose.connect(process.env.MONGODB_URI);

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const admin = await isAdmin();

  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  if (_id) {
    return Response.json( await Order.findById(_id) );
  }


  if (admin) {
    return Response.json( await Order.find() );
  }

  if (userEmail) {
    return Response.json( await Order.find({userEmail}) );
  }

}

export async function POST(req) {
  mongoose.connect(process.env.MONGODB_URI);

  const {cartProducts, address, paid = false} = await req.json();
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  
  console.log('Received address in order request:', address);

  try {
    
    let subtotal = 0;
    for (const product of cartProducts) {
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
    
    
    const deliveryFee = await calculateDeliveryFee(subtotal);
    
    const orderDoc = await Order.create({
      userEmail,
      phone: address.phone,
      streetAddress: address.streetAddress,
      city: address.city,
      notes: address.notes || '',
      cartProducts,
      paid,
      deliveryFee, 
    });
    
    
    Promise.resolve().then(async () => {
      try {
        await sendOrderNotification(orderDoc);
        console.log('Order notification email sent successfully');
      } catch (emailError) {
        console.error('Failed to send order notification email:', emailError);
      }
    });
    
  
    return Response.json({
      success: true,
      orderId: orderDoc._id.toString(),
      message: 'Поръчката е създадена успешно'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return Response.json({
      success: false,
      message: 'Грешка при създаване на поръчката'
    }, { status: 400 });
  }
}

export async function DELETE(req) {
  mongoose.connect(process.env.MONGODB_URI);
  
  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  
  if (!_id) {
    return Response.json({
      success: false,
      message: 'Не е предоставен ID на поръчка'
    }, { status: 400 });
  }
  
  try {
    
    const session = await getServerSession(authOptions);
    const admin = await isAdmin();
    
    if (!admin) {
      return Response.json({
        success: false,
        message: 'Нямате права за изтриване на поръчки'
      }, { status: 403 });
    }
    
    const result = await Order.findByIdAndDelete(_id);
    
    if (!result) {
      return Response.json({
        success: false,
        message: 'Поръчката не е намерена'
      }, { status: 404 });
    }
    
    return Response.json({
      success: true,
      message: 'Поръчката е изтрита успешно'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return Response.json({
      success: false,
      message: 'Грешка при изтриване на поръчката'
    }, { status: 500 });
  }
}