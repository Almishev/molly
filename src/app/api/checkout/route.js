import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {MenuItem} from "@/models/MenuItem";
import {Order} from "@/models/Order";
import {Settings} from "@/models/Settings";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";
const stripe = require('stripe')(process.env.STRIPE_SK);


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

export async function POST(req) {
  mongoose.connect(process.env.MONGODB_URI);

  const {cartProducts, address} = await req.json();
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  const orderDoc = await Order.create({
    userEmail,
    ...address,
    cartProducts,
    paid: false,
  });

  const stripeLineItems = [];
  
  
  let subtotal = 0;
  
  for (const cartProduct of cartProducts) {
    const productInfo = await MenuItem.findById(cartProduct._id);

    let productPrice = productInfo.basePrice;
    if (cartProduct.size) {
      const size = productInfo.sizes
        .find(size => size._id.toString() === cartProduct.size._id.toString());
      productPrice += size.price;
    }
    if (cartProduct.extras?.length > 0) {
      for (const cartProductExtraThing of cartProduct.extras) {
        const productExtras = productInfo.extraIngredientPrices;
        const extraThingInfo = productExtras
          .find(extra => extra._id.toString() === cartProductExtraThing._id.toString());
        productPrice += extraThingInfo.price;
      }
    }

    
    productPrice = parseFloat(productPrice.toFixed(2));
    subtotal += productPrice;

    const productName = cartProduct.name;

    stripeLineItems.push({
      quantity: 1,
      price_data: {
        currency: 'USD',
        product_data: {
          name: productName,
        },
        unit_amount: Math.round(productPrice * 100), 
      },
    });
  }
  

  const deliveryFee = await calculateDeliveryFee(subtotal);

 
  await Order.findByIdAndUpdate(orderDoc._id, { deliveryFee });

  const stripeSession = await stripe.checkout.sessions.create({
    line_items: stripeLineItems,
    mode: 'payment',
    customer_email: userEmail,
    success_url: process.env.NEXTAUTH_URL + 'orders/' + orderDoc._id.toString() + '?clear-cart=1',
    cancel_url: process.env.NEXTAUTH_URL + 'cart?canceled=1',
    metadata: {orderId:orderDoc._id.toString()},
    payment_intent_data: {
      metadata:{orderId:orderDoc._id.toString()},
    },
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: 'Delivery fee',
          type: 'fixed_amount',
          fixed_amount: {amount: Math.round(deliveryFee * 100), currency: 'USD'},
        },
      }
    ],
  });

  return Response.json(stripeSession.url);
}