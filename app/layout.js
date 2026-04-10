import './globals.css'

export const metadata = {
  title: 'AssoMemory',
  description: 'Assistant intelligent pour les associations loi 1901',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
