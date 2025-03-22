'use client';

import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import AuthProvider from '@/components/AuthProvider';
import { useEffect } from 'react';
import { initializeDataService } from '@/lib/data/dataService';
import { initializeDatabase } from '@/lib/data/initDatabase';

const inter = Inter({ subsets: ['latin'] });


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize database connection and data
    initializeDataService()
      .then(isDbConnected => {
        console.log(`Application started with ${isDbConnected ? 'database' : 'mock data'} service.`);
        
        // If database is connected, try to initialize it with basic data
        if (isDbConnected) {
          initializeDatabase()
            .then(success => {
              if (success) {
                console.log('Database initialization completed.');
              } else {
                console.warn('Database initialization failed.');
              }
            })
            .catch(error => {
              console.error('Error during database initialization:', error);
            });
        }
      })
      .catch(error => {
        console.error('Failed to initialize data service:', error);
      });
  }, []);

  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="ProjectPulse" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ProjectPulse" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#8B5CF6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#8B5CF6" />
        
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#8B5CF6" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} bg-[#1F2937] text-white antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
