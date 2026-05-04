import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { LanguageProvider } from '@/context/LanguageContext'
import './globals.css'

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Elián RC — Web Designer & Developer',
  description:
    'Diseño websites modernos, rápidos y funcionales que generan confianza y resultados. / I design modern, fast, and functional websites that build trust and deliver results.',
  metadataBase: new URL('https://elianrc.com'),
  openGraph: {
    title: 'Elián RC — Web Designer & Developer',
    description: 'Websites que impulsan ventas.',
    url: 'https://elianrc.com',
    siteName: 'Elián RC',
    locale: 'es_CR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${montserrat.className} antialiased bg-zinc-950 text-white`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
