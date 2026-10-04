import type { ReactNode } from 'react';
import { AuthProvider } from '@/context/auth-context';
import { ThemeProvider } from './theme-provider';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}