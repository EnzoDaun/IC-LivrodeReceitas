import React from 'react';
import { Box } from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SobreNos from '@/components/SobreNos/SobreNos';
import { primaryNavigationLinks } from '@/config/navigation';

const SobreNosPage = () => {
    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', py: '28px', px: { xs: 2, md: 3 } }}>
            <Navbar
                links={primaryNavigationLinks}
                initialActiveLink="Sobre nós"
            />
            <SobreNos />
            <Footer />
        </Box>
    );
};

export default SobreNosPage;