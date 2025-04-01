import {isAdmin} from "@/app/api/auth/[...nextauth]/route";
import {Category} from "@/models/Category";
import mongoose from "mongoose";


export async function GET() {
  mongoose.connect(process.env.MONGODB_URI);
  
  if (await isAdmin()) {
    try {
      
      const recommendedOrder = {
        'Гироси': 1,
        'Бургери': 2,
        'Порции': 3,
        'Салати': 4,
        'Десерти': 5,
        'Напитки': 6
      };
      
      
      const categories = await Category.find();
      
     
      for (const category of categories) {
        const order = recommendedOrder[category.name];
        if (order !== undefined) {
          await Category.updateOne({_id: category._id}, {order});
        }
      }
      
      return Response.json({
        success: true,
        message: 'Category orders updated successfully'
      });
    } catch (error) {
      return Response.json({
        success: false,
        message: error.message
      }, { status: 500 });
    }
  } else {
    return Response.json({
      success: false,
      message: 'Not authorized'
    }, { status: 401 });
  }
} 