import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { LanguageProvider } from '@/context/LanguageContext'
import './globals.css'

const montserrat = localFont({
  src: '../node_modules/@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2',
  display: 'swap',
  style: 'normal',
  weight: '100 900',
  variable: '--font-montserrat',
})

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
    <html lang="es" className={montserrat.variable}>
      <body className={`${montserrat.className} antialiased bg-zinc-950 text-white`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
