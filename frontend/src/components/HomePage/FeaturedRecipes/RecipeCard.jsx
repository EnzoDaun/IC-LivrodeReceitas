import PropTypes from 'prop-types';
import { FONT_PRIMARY } from '@/config/constants/styles';
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const HeartIcon = ({ filled }) => (
    <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: 21, height: 21, flexShrink: 0, cursor: 'pointer' }}
        fill={filled ? '#F05E46' : 'none'}
        stroke={filled ? '#F05E46' : '#111111'}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </Box>
);

const RecipeCard = ({ recipe, onView, onToggleFavorite }) => {
    const handleFavoriteClick = () => {
        const next = !recipe.isFavorite;
        if (onToggleFavorite) onToggleFavorite(recipe.id, next);
    };

    const handleViewClick = () => {
        if (onView) onView(recipe.id);
    };

    return (
        <Box sx={{
            width: '100%',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#FFFBF2',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Box sx={{ width: '100%', height: '190px', flexShrink: 0, overflow: 'hidden' }}>
                <Box
                    component="img"
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    sx={{
                        width: '100%',
                        height: '190px',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block',
                    }}
                />
            </Box>

            <Box sx={{ px: '14px', pt: '13px', pb: '12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: '8px' }}>
                    <Typography sx={{
                        fontFamily: FONT_PRIMARY,
                        fontSize: '18px',
                        fontWeight: 800,
                        color: '#262626',
                        lineHeight: '22px',
                        minWidth: 0,
                        overflowWrap: 'anywhere',
                    }}>
                        {recipe.title}
                    </Typography>
                    <Box onClick={handleFavoriteClick} sx={{ ml: '8px', mt: '1px' }}>
                        <HeartIcon filled={recipe.isFavorite} />
                    </Box>
                </Box>

                <Typography sx={{
                    fontFamily: FONT_PRIMARY,
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#6B6B6B',
                    lineHeight: '17px',
                    flex: 1,
                }}>
                    {recipe.excerpt}
                </Typography>

                <Box sx={{
                    display: 'flex',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    justifyContent: 'space-between',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: '8px', sm: '10px' },
                    mt: '12px',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0, minHeight: '18px' }}>
                        {Array.from({ length: 5 }, (_, i) => (
                            <Box
                                key={i}
                                component="span"
                                sx={{
                                    fontSize: '15px',
                                    lineHeight: 1,
                                    color: i < Math.round(recipe.rating || 0) ? '#FFC928' : '#D4CEC7',
                                }}
                            >
                                ★
                            </Box>
                        ))}
                        {(recipe.ratingCount > 0) && (
                            <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '10px', color: '#9A958D', ml: '3px', lineHeight: 1 }}>
                                ({recipe.ratingCount})
                            </Typography>
                        )}
                    </Box>

                    <Typography sx={{
                        fontFamily: FONT_PRIMARY,
                        fontSize: '10px',
                        fontWeight: 800,
                        color: '#222222',
                        lineHeight: '13px',
                        whiteSpace: 'nowrap',
                        textTransform: 'uppercase',
                    }}>
                        {`${recipe.time} · ${recipe.difficulty} · ${recipe.portions}`}
                    </Typography>

                    <Button
                        variant="outlined"
                        onClick={handleViewClick}
                        disableElevation
                        disableRipple
                        sx={{
                            width: { xs: '100%', sm: '82px' },
                            height: '26px',
                            borderRadius: '999px',
                            border: '1px solid #222222',
                            backgroundColor: 'transparent',
                            color: '#222222',
                            fontFamily: FONT_PRIMARY,
                            fontSize: '10px',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.2px',
                            minWidth: 'unset',
                            p: 0,
                            boxShadow: 'none',
                            alignSelf: { xs: 'stretch', sm: 'center' },
                            '&:hover': {
                                backgroundColor: 'rgba(34,34,34,0.05)',
                                border: '1px solid #222222',
                                boxShadow: 'none',
                            },
                        }}
                    >
                        VER RECEITA
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

RecipeCard.propTypes = {
    recipe: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        excerpt: PropTypes.string,
        imageUrl: PropTypes.string,
        rating: PropTypes.number,
        ratingCount: PropTypes.number,
        time: PropTypes.string,
        difficulty: PropTypes.string,
        portions: PropTypes.string,
        isFavorite: PropTypes.bool,
    }).isRequired,
    onView: PropTypes.func,
    onToggleFavorite: PropTypes.func,
};

export default RecipeCard;
