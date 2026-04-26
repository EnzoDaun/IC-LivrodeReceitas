import React from 'react';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
    EnergySavingsLeaf as EnergySavingsLeafIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import { FONT_SANS } from '@/config/constants/styles';

const valueColumns = [
    {
        title: 'Respeito',
        text: 'Valorizar cada ingrediente — cascas, talos, sementes — evitando desperdícios e aproveitando ao máximo o que a natureza oferece.',
        icon: EnergySavingsLeafIcon,
    },
    {
        title: 'Cuidado',
        text: 'Preparar alimentos com atenção, afeto e consciência sobre o impacto de cada escolha na mesa e no planeta.',
        icon: FavoriteBorderIcon,
    },
    {
        title: 'Equilíbrio',
        text: 'Unir sabor, praticidade e responsabilidade para transformar a rotina na cozinha em um ato de cuidado coletivo.',
        icon: RestaurantIcon,
    },
];

const EbookValues = () => (
    <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto', textAlign: 'center', color: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3.5 }}>
        <Box sx={{ maxWidth: 720, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h2" sx={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#FFFFFF', fontWeight: 700, fontSize: { xs: '34px', md: '52px' }, lineHeight: 1.1 }}>
                Nossos Valores
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: FONT_SANS, color: alpha('#FFFFFF', 0.82), fontSize: { xs: '16px', md: '20px' }, lineHeight: 1.5 }}>
                Os princípios que guiam cada receita e cada escolha na cozinha
            </Typography>
        </Box>
        <Box sx={{ width: '100%', display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: { xs: 3, md: 4 }, alignItems: 'start' }}>
            {valueColumns.map(({ title, text, icon: ValueIcon }) => (
                <Box key={title} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1.5, px: { xs: 1, md: 2 } }}>
                    <Box sx={{ width: 78, height: 78, borderRadius: '50%', backgroundColor: alpha('#FFFFFF', 0.14), border: `1px solid ${alpha('#FFFFFF', 0.28)}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ValueIcon sx={{ fontSize: 36, color: '#FFFFFF' }} />
                    </Box>
                    <Typography variant="h6" component="h3" sx={{ fontFamily: FONT_SANS, color: '#FFFFFF', fontWeight: 700, fontSize: { xs: '19px', md: '22px' }, lineHeight: 1.2 }}>
                        {title}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: FONT_SANS, color: alpha('#FFFFFF', 0.78), fontSize: { xs: '14px', md: '15px' }, lineHeight: 1.6, maxWidth: 280 }}>
                        {text}
                    </Typography>
                </Box>
            ))}
        </Box>
    </Box>
);

export default EbookValues;
