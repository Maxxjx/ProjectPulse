import type React from "react"
import "./globals.css"
import { Providers } from "./providers"
import type { Metadata } from "next"

// Import the database initialization function
import { initDatabaseConnection } from "@/lib/db-init"

export const metadata: Metadata = {
  title: "ProjectPulse - Project Management System",
  description: "A comprehensive project management system for teams",
}

// Initialize database connection when the app starts
initDatabaseConnection().catch((error : any) => {
  console.error("Failed to initialize database:", error)
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

