import {isAdmin} from "@/app/api/auth/[...nextauth]/route";
import {Category} from "@/models/Category";
import mongoose from "mongoose";

export async function POST(req) {
  mongoose.connect(process.env.MONGODB_URI);
  const {name, order} = await req.json();
  if (await isAdmin()) {
    const categoryDoc = await Category.create({name, order});
    return Response.json(categoryDoc);
  } else {
    return Response.json({});
  }
}

export async function PUT(req) {
  mongoose.connect(process.env.MONGODB_URI);
  const {_id, name, order} = await req.json();
  if (await isAdmin()) {
    await Category.updateOne({_id}, {name, order});
  }
  return Response.json(true);
}

export async function GET() {
  mongoose.connect(process.env.MONGODB_URI);
  // Sort first by order, then by name for categories with the same order
  return Response.json(
    await Category.find().sort({order: 1, name: 1})
  );
}

export async function DELETE(req) {
  mongoose.connect(process.env.MONGODB_URI);
  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  if (await isAdmin()) {
    await Category.deleteOne({_id});
  }
  return Response.json(true);
}