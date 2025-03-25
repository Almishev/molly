import clientPromise from "@/libs/mongoConnect";
import {UserInfo} from "@/models/UserInfo";
import bcrypt from "bcrypt";
import * as mongoose from "mongoose";
import {User} from '@/models/User';
import NextAuth, {getServerSession} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { MongoDBAdapter } from "@auth/mongodb-adapter"

export const authOptions = {
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV !== "production",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "email,public_profile",
          response_type: "code",
        },
      },
      profile(profile) {
        console.log("Facebook profile:", profile);
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url,
        };
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      id: 'credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const email = credentials?.email;
        const password = credentials?.password;
        
        console.log('Attempting login with:', { email });

        mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({email});
        console.log('Found user:', user);
        
        const passwordOk = user && bcrypt.compareSync(password, user.password);
        console.log('Password check:', { passwordOk });

        if (passwordOk) {
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || user.email,
          };
        }

        return null;
      }
    })
  ],
};

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return false;
  }
  const userInfo = await UserInfo.findOne({email:userEmail});
  if (!userInfo) {
    return false;
  }
  return userInfo.admin;
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }