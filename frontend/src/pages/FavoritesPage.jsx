import React from 'react';
import { Box } from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FavoritesContent from '@/components/Favorites/FavoritesContent';
import { primaryNavigationLinks } from '@/config/navigation';

const FavoritesPage = () => (
    <Box sx={{ maxWidth: 1100, mx: 'auto', py: '28px', px: { xs: 2, md: 3 } }}>
        <Navbar links={primaryNavigationLinks} initialActiveLink="Favoritas" />
        <FavoritesContent />
        <Footer />
    </Box>
);

export default FavoritesPage;
