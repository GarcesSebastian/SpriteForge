import type { Metadata } from "next";
import { AppContextProvider } from "@/contexts/AppContext";
import { SocketProvider } from "@/contexts/SocketContext";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: 'SpriteForge - Advanced Sprite Animation Testing Platform',
  description: 'Professional web platform for testing, previewing, and fine-tuning sprite animations in real-time. Perfect for game developers, animators, and digital artists. Test multiple sprites, control animations, and debug with precision.',
  keywords: [
    'sprite animation',
    'game development',
    'animation testing',
    'sprite sheets',
    'pixel art',
    'game assets',
    'animation preview',
    'sprite editor',
    'game tools',
    'animation tools',
    'sprite debugging',
    'frame animation',
    'character animation',
    'sprite controller',
    'animation playground'
  ],
  authors: [{ name: 'Sebxstt' }],
  creator: 'Sebxstt',
  publisher: 'Sebxstt',
  metadataBase: new URL('https://spriteforge.garcessebastian.com'),
  openGraph: {
    title: 'SpriteForge - Advanced Sprite Animation Testing Platform',
    description: 'Professional web platform for testing, previewing, and fine-tuning sprite animations in real-time. Perfect for game developers, animators, and digital artists.',
    url: 'https://spriteforge.garcessebastian.com',
    siteName: 'SpriteForge',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'SpriteForge - Sprite Animation Testing Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpriteForge - Advanced Sprite Animation Testing Platform',
    description: 'Professional web platform for testing, previewing, and fine-tuning sprite animations in real-time. Perfect for game developers, animators, and digital artists.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'technology',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3B82F6' },
    { media: '(prefers-color-scheme: dark)', color: '#1E40AF' },
  ],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    title: 'SpriteForge',
    statusBarStyle: 'black-translucent',
    capable: true,
  },
  applicationName: 'SpriteForge',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-gray-900">
      <head>
        <meta name="google-site-verification" content="BT6A1CYMlT549EKMmzXOaKlJkD7C7MST2SNmGmQmj5c" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
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
