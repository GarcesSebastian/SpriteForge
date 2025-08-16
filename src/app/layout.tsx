import type { Metadata } from "next";
import "@/styles/globals.css";

import { AppContextProvider } from "@/contexts/AppContext";
import { SocketProvider } from "@/contexts/SocketContext";

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
    <html lang="en" className="h-full bg-gray-900">
      <body className="h-full overflow-hidden antialiased">
        <SocketProvider>
          <AppContextProvider>
            {children}
          </AppContextProvider>
        </SocketProvider>
      </body>
    </html>
  );
}
