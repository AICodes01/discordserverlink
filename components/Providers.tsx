"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import PageProgress from "@/components/PageProgress";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PageProgress />
      {children}
    </SessionProvider>
  );
}
