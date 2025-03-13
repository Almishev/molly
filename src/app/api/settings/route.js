import {isAdmin} from "@/app/api/auth/[...nextauth]/route";
import {Settings} from "@/models/Settings";
import mongoose from "mongoose";

// Получаване на всички настройки или конкретна настройка
export async function GET(req) {
  mongoose.connect(process.env.MONGODB_URI);
  
  const url = new URL(req.url);
  const name = url.searchParams.get('name');
  
  if (name) {
    // Връщане на конкретна настройка по име
    const setting = await Settings.findOne({name});
    if (!setting) {
      return Response.json({error: 'Setting not found'}, {status: 404});
    }
    return Response.json(setting);
  }
  
  // Връщане на всички настройки
  const settings = await Settings.find({});
  return Response.json(settings);
}

// Създаване или обновяване на настройка
export async function POST(req) {
  mongoose.connect(process.env.MONGODB_URI);
  
  // Проверка дали потребителят е администратор
  if (!(await isAdmin())) {
    return Response.json({error: 'Unauthorized'}, {status: 401});
  }
  
  const {name, value, description} = await req.json();
  
  if (!name || value === undefined) {
    return Response.json({error: 'Name and value are required'}, {status: 400});
  }
  
  // Опит за намиране на съществуваща настройка
  let setting = await Settings.findOne({name});
  
  if (setting) {
    // Обновяване на съществуваща настройка
    setting.value = value;
    if (description) {
      setting.description = description;
    }
    await setting.save();
  } else {
    // Създаване на нова настройка
    setting = await Settings.create({
      name,
      value,
      description: description || '',
    });
  }
  
  return Response.json(setting);
}

// Изтриване на настройка
export async function DELETE(req) {
  mongoose.connect(process.env.MONGODB_URI);
  
  // Проверка дали потребителят е администратор
  if (!(await isAdmin())) {
    return Response.json({error: 'Unauthorized'}, {status: 401});
  }
  
  const url = new URL(req.url);
  const name = url.searchParams.get('name');
  
  if (!name) {
    return Response.json({error: 'Name parameter is required'}, {status: 400});
  }
  
  await Settings.deleteOne({name});
  
  return Response.json({success: true});
} 