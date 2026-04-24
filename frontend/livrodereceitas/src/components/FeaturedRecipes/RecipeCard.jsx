import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

const FONT = "'Poppins', Inter, system-ui, sans-serif";

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
    const [isFavorite, setIsFavorite] = useState(false);

    const handleFavoriteClick = () => {
        const next = !isFavorite;
        setIsFavorite(next);
        if (onToggleFavorite) onToggleFavorite(recipe.id, next);
    };

    const handleViewClick = () => {
        if (onView) onView(recipe.id);
    };

    return (
        <Box sx={{
            width: '100%',
            borderRadius: '10px',
            overflow: 'hidden',
            backgroundColor: '#FFFBF2',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Imagem */}
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

            {/* Conteúdo */}
            <Box sx={{ px: '14px', pt: '13px', pb: '12px', display: 'flex', flexDirection: 'column', flex: 1 }}>

                {/* Título + coração */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: '8px' }}>
                    <Typography sx={{
                        fontFamily: FONT,
                        fontSize: '18px',
                        fontWeight: 800,
                        color: '#262626',
                        lineHeight: '22px',
                    }}>
                        {recipe.title}
                    </Typography>
                    <Box onClick={handleFavoriteClick} sx={{ ml: '8px', mt: '1px' }}>
                        <HeartIcon filled={isFavorite} />
                    </Box>
                </Box>

                {/* Descrição */}
                <Typography sx={{
                    fontFamily: FONT,
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#6B6B6B',
                    lineHeight: '17px',
                    flex: 1,
                }}>
                    {recipe.excerpt}
                </Typography>

                {/* Rodapé */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: '12px',
                }}>
                    {/* Estrelas */}
                    <Typography sx={{
                        fontFamily: FONT,
                        fontSize: '17px',
                        fontWeight: 700,
                        color: '#FFC928',
                        letterSpacing: '0px',
                        lineHeight: 1,
                    }}>
                        ★★★★★
                    </Typography>

                    {/* Meta */}
                    <Typography sx={{
                        fontFamily: FONT,
                        fontSize: '10px',
                        fontWeight: 800,
                        color: '#222222',
                        lineHeight: '13px',
                        whiteSpace: 'nowrap',
                        textTransform: 'uppercase',
                    }}>
                        {recipe.time} · {recipe.difficulty} · {recipe.portions}
                    </Typography>

                    {/* Botão */}
                    <Button
                        variant="outlined"
                        onClick={handleViewClick}
                        disableElevation
                        disableRipple
                        sx={{
                            width: '82px',
                            height: '26px',
                            borderRadius: '999px',
                            border: '1px solid #222222',
                            backgroundColor: 'transparent',
                            color: '#222222',
                            fontFamily: FONT,
                            fontSize: '10px',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.2px',
                            minWidth: 'unset',
                            p: 0,
                            boxShadow: 'none',
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

export default RecipeCard;
