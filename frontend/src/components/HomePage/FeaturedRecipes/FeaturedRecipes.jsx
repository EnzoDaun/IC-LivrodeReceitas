import { FONT_PRIMARY } from '@/config/constants/styles';
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import RecipeCard from '@/components/HomePage/FeaturedRecipes/RecipeCard';

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

const ChevronLeft = ({ active }) => (
    <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: 11, height: 11 }}
        fill="none"
        stroke={active ? '#111111' : '#C9C0B4'}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="15 18 9 12 15 6" />
    </Box>
);

const ChevronRight = ({ active }) => (
    <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: 11, height: 11 }}
        fill="none"
        stroke={active ? '#111111' : '#C9C0B4'}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="9 18 15 12 9 6" />
    </Box>
);

const PAGE_SIZE = 2;

const FeaturedRecipes = ({
    recipes,
    isLoading = false,
    errorMessage = '',
    onViewRecipe,
    onToggleFavorite,
    title = 'RECEITAS EM DESTAQUE',
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const canScrollLeft = currentIndex > 0;
    const canScrollRight = currentIndex + PAGE_SIZE < (recipes?.length ?? 0);
    const displayed = recipes ? recipes.slice(currentIndex, currentIndex + PAGE_SIZE) : [];

    const handlePrev = () => {
        if (canScrollLeft) setCurrentIndex((i) => i - PAGE_SIZE);
    };

    const handleNext = () => {
        if (canScrollRight) setCurrentIndex((i) => i + PAGE_SIZE);
    };

    useEffect(() => {
        if (!recipes || recipes.length <= PAGE_SIZE) return;
        const id = setInterval(() => {
            setCurrentIndex((i) => (i + PAGE_SIZE >= recipes.length ? 0 : i + PAGE_SIZE));
        }, 10000);
        return () => clearInterval(id);
    }, [recipes]);

    return (
        <Box sx={{
            width: '100%',
            backgroundColor: 'transparent',
            boxSizing: 'border-box',
            mt: '16px',
        }}>
            <Box sx={{
                width: '100%',
                border: '1px solid #C9C0B4',
                borderRadius: '19px',
                backgroundColor: 'transparent',
                boxSizing: 'border-box',
                p: '20px 16px 16px 16px',
                position: 'relative',
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: '18px',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                        <StarIcon />
                        <Typography sx={{
                            fontFamily: FONT_PRIMARY,
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

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Box
                            onClick={handlePrev}
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
                            <ChevronLeft active={canScrollLeft} />
                        </Box>
                        <Box
                            onClick={handleNext}
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
                            <ChevronRight active={canScrollRight} />
                        </Box>
                    </Box>
                </Box>

                <Box
                    key={currentIndex}
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '10px',
                        '@keyframes carouselFadeIn': {
                            from: { opacity: 0, transform: 'translateY(10px)' },
                            to:   { opacity: 1, transform: 'translateY(0)' },
                        },
                        animation: 'carouselFadeIn 0.4s ease-out',
                    }}
                >
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
                    {!isLoading && !errorMessage && (recipes?.length === 0) && (
                        <Typography sx={{ color: '#6B6B6B', fontSize: '14px' }}>
                            Nenhuma receita avaliada ainda.
                        </Typography>
                    )}
                    {displayed.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            onView={onViewRecipe}
                            onToggleFavorite={onToggleFavorite}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default FeaturedRecipes;
