import type { Metadata } from 'next';
import { Lora, Inter, Amiri } from 'next/font/google';
import './globals.css';

const lora = Lora({ subsets: ['latin'], variable: '--font-serif' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const amiri = Amiri({ weight: ['400', '700'], subsets: ['arabic'], variable: '--font-arabic' });

export const metadata: Metadata = {
  title: 'Rakiz (ركز)',
  description: 'A minimalist Pomodoro application designed for Muslim students and professionals.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lora.variable} ${inter.variable} ${amiri.variable}`}>
      <body suppressHydrationWarning className="antialiased">{children}</body>
    </html>
  );
}
