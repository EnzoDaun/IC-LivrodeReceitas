import React from 'react';
import { Box, Typography } from '@mui/material';
import RecipeCard from './RecipeCard';

const FONT = "'Poppins', Inter, system-ui, sans-serif";

const StarIcon = () => (
    <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: 23, height: 23, flexShrink: 0 }}
        fill="none"
        stroke="#111111"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </Box>
);

const ChevronLeft = () => (
    <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: 11, height: 11 }}
        fill="none"
        stroke="#C9C0B4"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="15 18 9 12 15 6" />
    </Box>
);

const ChevronRight = () => (
    <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: 11, height: 11 }}
        fill="none"
        stroke="#111111"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="9 18 15 12 9 6" />
    </Box>
);

const FeaturedRecipes = ({
    recipes,
    onViewRecipe,
    title = 'RECEITAS EM DESTAQUE',
}) => {
    const canScrollLeft = false;
    const canScrollRight = true;

    const handleToggleFavorite = (recipeId, isFavorite) => {
        console.log(`Recipe ${recipeId} favorite:`, isFavorite);
    };

    const displayed = recipes ? recipes.slice(0, 2) : [];

    return (
        <Box sx={{
            width: '100%',
            backgroundColor: 'transparent',
            boxSizing: 'border-box',
            mt: '16px',
        }}>
            {/* Container principal */}
            <Box sx={{
                width: '100%',
                border: '1px solid #C9C0B4',
                borderRadius: '19px',
                backgroundColor: 'transparent',
                boxSizing: 'border-box',
                p: '20px 16px 16px 16px',
                position: 'relative',
            }}>
                {/* Cabeçalho */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: '18px',
                }}>
                    {/* Título com estrela */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                        <StarIcon />
                        <Typography sx={{
                            fontFamily: FONT,
                            fontSize: '26px',
                            fontWeight: 800,
                            color: '#282828',
                            lineHeight: '30px',
                            letterSpacing: '0.2px',
                            whiteSpace: 'nowrap',
                        }}>
                            {title}
                        </Typography>
                    </Box>

                    {/* Setas de navegação */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Box
                            sx={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                border: `1px solid ${canScrollLeft ? '#111111' : '#C9C0B4'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: canScrollLeft ? 'pointer' : 'default',
                                backgroundColor: 'transparent',
                            }}
                        >
                            <ChevronLeft />
                        </Box>
                        <Box
                            sx={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                border: `1px solid ${canScrollRight ? '#111111' : '#C9C0B4'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: canScrollRight ? 'pointer' : 'default',
                                backgroundColor: 'transparent',
                            }}
                        >
                            <ChevronRight />
                        </Box>
                    </Box>
                </Box>

                {/* Cards */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '10px',
                }}>
                    {displayed.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            onView={onViewRecipe}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default FeaturedRecipes;
