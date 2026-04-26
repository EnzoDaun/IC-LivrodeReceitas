import { useMemo, useState } from 'react';
import { Box, Typography, Button, Stack, Chip } from '@mui/material';
import { journeyFilters } from '@/config/navigation';
import JourneyCard from './JourneyCard';

function normalizeFilter(value) {
    return (value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase();
}

export default function Journey({
    recipes = [],
    isLoading = false,
    errorMessage = '',
    onViewRecipe,
}) {
    const [activeFilter, setActiveFilter] = useState('TODAS');

    const displayedRecipes = useMemo(() => {
        if (activeFilter === 'TODAS') return recipes;

        return recipes.filter((recipe) => (
            normalizeFilter(recipe.category) === activeFilter
        ));
    }, [activeFilter, recipes]);

    return (
        <Box sx={{ width: '100%', bgcolor: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'stretch', pt: '51px', pb: '36px' }}>
            <Stack alignItems="center" textAlign="center" width="100%">
                <Chip
                    label="TODAS AS RECEITAS"
                    sx={{
                        bgcolor: '#EE6352',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.6px',
                        height: 28,
                        borderRadius: '999px',
                        mb: '10px',
                        '& .MuiChip-label': { px: '14px' },
                    }}
                />
                <Typography
                    component="h2"
                    sx={{ fontSize: { xs: '36px', md: '48px' }, fontWeight: 900, lineHeight: 1.05, color: '#262522', textTransform: 'uppercase', textAlign: 'center' }}
                >
                    EMBARQUE EM
                    <br />
                    UMA JORNADA
                </Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#777570', mt: '10px' }}>
                    Descubra nossa colecao de receitas publicadas
                </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="center" gap="10px" sx={{ mt: '28px', flexWrap: 'wrap', width: '100%' }}>
                {journeyFilters.map((filter) => {
                    const isActive = activeFilter === filter;
                    return (
                        <Button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            disableElevation
                            disableRipple
                            sx={{
                                height: 36,
                                borderRadius: '999px',
                                fontSize: '12px',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.3px',
                                px: isActive ? '22px' : '18px',
                                minWidth: 'unset',
                                whiteSpace: 'nowrap',
                                bgcolor: isActive ? '#9FDC26' : 'transparent',
                                border: isActive ? '1px solid #262522' : '1px solid #C9C6BE',
                                color: isActive ? '#262522' : '#9A9892',
                                '&:hover': { bgcolor: isActive ? '#8fcc16' : 'rgba(0,0,0,0.04)' },
                            }}
                        >
                            {filter}
                        </Button>
                    );
                })}
            </Stack>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: '20px 16px', mt: '32px', width: '100%' }}>
                {isLoading && (
                    <Typography sx={{ color: '#6B6B6B', fontSize: '14px' }}>
                        Carregando receitas...
                    </Typography>
                )}
                {!isLoading && errorMessage && (
                    <Typography sx={{ color: '#9F2D20', fontSize: '14px' }}>
                        {errorMessage}
                    </Typography>
                )}
                {!isLoading && !errorMessage && displayedRecipes.length === 0 && (
                    <Typography sx={{ color: '#6B6B6B', fontSize: '14px' }}>
                        Nenhuma receita encontrada para este filtro.
                    </Typography>
                )}
                {displayedRecipes.map((recipe) => (
                    <JourneyCard
                        key={recipe.id}
                        recipe={recipe}
                        onView={() => onViewRecipe?.(recipe.id)}
                    />
                ))}
            </Box>
        </Box>
    );
}
