import React from 'react';
import {Box} from '@mui/material';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import SobreNos from '../components/SobreNos/SobreNos';
import {primaryNavigationLinks} from '../config/navigation';

const SobreNosPage = () => {
    const handleSearch = (query) => {
        console.log('Pesquisando por:', query);
    };

    return (
        <Box sx={{maxWidth: 1100, mx: 'auto', py: '28px', px: {xs: 2, md: 3}}}>
            <Navbar
                links={primaryNavigationLinks}
                onSearch={handleSearch}
                initialActiveLink="Sobre nós"
            />
            <SobreNos/>
            <Footer/>
        </Box>
    );
};

export default SobreNosPage;

