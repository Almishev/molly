import {User} from "@/models/User";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export async function POST(req) {
  const body = await req.json();
  mongoose.connect(process.env.MONGODB_URI);
  const pass = body.password;
  if (!pass?.length || pass.length < 5) {
    return Response.json({error: 'password must be at least 5 characters'}, {status: 400});
  }

  const email = body.email;
  if (!email?.includes('@')) {
    return Response.json({error: 'invalid email'}, {status: 400});
  }

  try {
    const notHashedPassword = pass;
    const salt = bcrypt.genSaltSync(10);
    body.password = bcrypt.hashSync(notHashedPassword, salt);

    const createdUser = await User.create(body);
    console.log('User created:', createdUser);
    return Response.json(createdUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return Response.json({error: 'error creating user'}, {status: 400});
  }
}