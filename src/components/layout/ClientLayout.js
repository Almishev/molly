'use client';

import {AppProvider} from "@/components/AppContext";
import Header from "@/components/layout/Header";
import {Toaster} from "react-hot-toast";
import {SessionProvider} from "next-auth/react";

export default function ClientLayout({children}) {
  return (
    <SessionProvider>
      <AppProvider>
        <Toaster />
        <Header />
        {children}
      </AppProvider>
    </SessionProvider>
  );
} 