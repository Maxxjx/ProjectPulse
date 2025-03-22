// app/metadata.tsx
import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'ProjectPulse',
  description: 'A comprehensive project management system',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ProjectPulse',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#8B5CF6',
};

export default metadata;
