import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { LOCAL_BUSINESS_JSON_LD } from '@/lib/seo'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const SITE = 'https://dgmconstructionllc.com'
const TITLE = 'DGM Construction LLC | Roofing, Siding & Exterior Restoration | Neptune City, NJ'
const DESCRIPTION =
  'DGM Construction LLC — licensed roofing, siding, gutter & roof inspection services in Neptune City, Monmouth County & NJ. Free inspections. 50-mile radius. Call +1 (732) 231-5321.'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#003466',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'DGM Construction LLC',
    'roofing Neptune City NJ',
    'roof replacement Monmouth County',
    'siding contractor New Jersey',
    'gutter services NJ',
    'roof inspection Neptune City',
    'storm damage roofing NJ',
    'residential roofing contractor',
  ],
  authors: [{ name: 'DGM Construction LLC' }],
  creator: 'DGM Construction LLC',
  publisher: 'DGM Construction LLC',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: SITE },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    locale: 'en_US',
    url: SITE,
    siteName: 'DGM Construction LLC',
    images: [
      {
        url: '/images/roofing-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Professional residential roofing by DGM Construction LLC in New Jersey',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/images/roofing-1.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSON_LD) }}
        />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-white pb-[calc(4.5rem+env(safe-area-inset-bottom))] font-sans text-brand-charcoal antialiased lg:pb-0">
        {children}
      </body>
    </html>
  )
}
