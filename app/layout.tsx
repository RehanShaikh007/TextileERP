// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import AuthWrapper from "@/components/AuthWrapper";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Textile ERP System",
  description: "Complete textile business management system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <html lang="en">
          <body className={inter.className}>
            <header className="w-full flex justify-end items-center p-4 border-b">
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal" />
              </SignedOut>
            </header>
            <AuthWrapper>
              {children}
            </AuthWrapper>
            <Toaster />
          </body>
        </html>
      </ThemeProvider>
    </ClerkProvider>
  );
}
