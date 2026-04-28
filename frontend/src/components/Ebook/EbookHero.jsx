import React from 'react';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Navbar from '@/components/Navbar';
import { primaryNavigationLinks } from '@/config/navigation';
import { FONT_SANS } from '@/config/constants/styles';

const EbookHero = () => (
    <Box
        component="section"
        sx={{
            backgroundImage: 'url(/assets/ebookImages/EbookBackgroundImage.png)',
            backgroundSize: '60% auto',
            backgroundPosition: 'bottom center',
            backgroundRepeat: 'repeat',
        }}
    >
        <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, md: 3 }, pt: '28px' }}>
            <Navbar links={primaryNavigationLinks} initialActiveLink="E-book" />
        </Box>

        <Box sx={{ minHeight: { xs: 360, md: 480 }, px: { xs: 2.5, md: 4 }, py: { xs: 3, md: 4 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 840, mx: 'auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Typography
                    variant="body1"
                    sx={{ fontFamily: FONT_SANS, px: { xs: 3, md: 5 }, py: 1.5, backgroundColor: (theme) => alpha(theme.palette.sustainable.main, 0.74), borderRadius: '90px', color: 'sustainable.contrastText', fontWeight: 600, fontSize: { xs: '16px', md: '18px' } }}
                >
                    Nossa Jornada Sustentável
                </Typography>
                <Typography
                    variant="h1"
                    sx={{ fontFamily: 'Georgia, "Times New Roman", serif', color: 'text.primary', fontWeight: 700, fontSize: { xs: '34px', md: '54px' }, lineHeight: 1 }}
                >
                    Raízes e sabores: afeto em cada parte do alimento
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ fontFamily: FONT_SANS, color: 'text.primary', fontSize: { xs: '16px', md: '20px' }, lineHeight: 1.5, maxWidth: 680 }}
                >
                    Origem, memória, sentimento e propósito — uma jornada de descoberta, amor pela natureza e compromisso com o planeta
                </Typography>
            </Box>
        </Box>
    </Box>
);

export default EbookHero;
