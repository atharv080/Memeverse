import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/themeprovider';
import { Providers } from '@/store/provider';
import Navigation from '@/components/common/Navigation';

const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'MemeVerse',
//   description: 'Your Ultimate Meme Platform',
// };
export const metadata: Metadata = {
  title: 'MemeVerse - 404 Not Found',
  description: 'Page not found',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-950 text-gray-900 dark:text-white`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <div className="min-h-screen transition-colors duration-300">
              <Navigation />
              <main className="container mx-auto px-4 pt-16">
                {children}
              </main>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}