// DENTORA-OS - ROOT LAYOUT
// This is the root layout that wraps all other layouts

import { ReactNode } from 'react';
import './[lang]/globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
