import type { Metadata } from "next";
import { Cairo } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MatchFlow — منصة المطابقة المالية",
  description:
    "منصة SaaS متعددة المستأجرين للمطابقة المالية الآلية عبر البنوك ومزوّدي الدفع وأنظمة تخطيط الموارد.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
