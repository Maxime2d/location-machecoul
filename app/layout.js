import './globals.css'

export const metadata = {
  title: 'Maison de ville T4 - Machecoul-Saint-Même | Location Particulier',
  description: 'Location maison T4 86m² à Machecoul-Saint-Même - 900€/mois - 3 chambres - Garage - Jardin',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
