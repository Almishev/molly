import {authOptions, isAdmin} from "@/app/api/auth/[...nextauth]/route";
import {Order} from "@/models/Order";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";
import { sendOrderNotification } from "@/helpers/mailer";

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

  try {
    const orderDoc = await Order.create({
      userEmail,
      ...address,
      cartProducts,
      paid,
    });
    
    // Изпращане на имейл за нова поръчка
    try {
      await sendOrderNotification(orderDoc);
      console.log('Order notification email sent successfully');
    } catch (emailError) {
      console.error('Failed to send order notification email:', emailError);
      // Продължаваме изпълнението, дори ако имейлът не е изпратен успешно
    }
    
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
    // Проверка дали потребителят е администратор
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