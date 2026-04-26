import React from 'react';
import {Box} from '@mui/material';
import Footer from '@/components/Footer';
import EbookHero from '@/components/Ebook/EbookHero';
import EbookContent from '@/components/Ebook/EbookContent';

const EbookPage = () => (
    <Box>
        <EbookHero />
        <EbookContent />
        <Box sx={{backgroundColor: 'background.paper', display: 'flow-root', width: '100%'}}>
            <Box sx={{maxWidth: 1100, mx: 'auto', px: {xs: 2, md: 3}}}>
                <Footer />
            </Box>
        </Box>
    </Box>
);

export default EbookPage;
