import React from 'react';
import { Box } from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChefDashboard from '@/components/ChefDashboard/ChefDashboard';
import { primaryNavigationLinks } from '@/config/navigation';

const ChefDashboardPage = () => (
    <Box sx={{ maxWidth: 1100, mx: 'auto', py: '28px', px: { xs: 2, md: 3 } }}>
        <Navbar links={primaryNavigationLinks} initialActiveLink="Receitas" />
        <ChefDashboard />
        <Footer />
    </Box>
);

export default ChefDashboardPage;
