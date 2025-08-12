import type { Metadata } from "next";
import "@/styles/globals.css";

import { AppContextProvider } from "@/contexts/AppContext";

export const metadata: Metadata = {
  title: "Sprite",
  description: "Testing Sprite v2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppContextProvider>
          {children}
        </AppContextProvider>
      </body>
    </html>
  );
}
