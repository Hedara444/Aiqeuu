import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { Navbar } from '../ui/navbar';
import { Footer } from '../ui/Footer';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};