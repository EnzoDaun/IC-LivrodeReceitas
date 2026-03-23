import React, {useState} from 'react';
import {
    Box,
    Typography,
    IconButton,
    Paper,
} from '@mui/material';
import {
    StarBorder as StarBorderIcon,
    ArrowBackIos as ArrowBackIcon,
    ArrowForwardIos as ArrowForwardIcon,
} from '@mui/icons-material';
import RecipeCard from './RecipeCard';

const FeaturedRecipes = ({
                             recipes,
                             onViewRecipe,
                             title = 'RECEITAS EM DESTAQUE',
                         }) => {
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const handleToggleFavorite = (recipeId, isFavorite) => {
        console.log(`Recipe ${recipeId} favorite status:`, isFavorite);
    };

    return (
        <Paper
            elevation={0}
            sx={{
                mt: 4,
                borderRadius: '24px',
                p: {xs: 3, md: 4},
                backgroundColor: 'transparent',
                border: '1.5px solid rgba(0, 0, 0, 0.08)',
                boxShadow: 'none',
            }}
        >
            {/* Cabeçalho */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3.5,
                }}
            >
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1.25}}>
                    <StarBorderIcon sx={{color: '#2D2D2D', fontSize: 24, strokeWidth: 0.5}}/>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            fontSize: {xs: '18px', sm: '20px'},
                            letterSpacing: '0.8px',
                            color: '#2D2D2D',
                        }}
                    >
                        {title}
                    </Typography>
                </Box>

                {/* Botões de navegação */}
                <Box sx={{display: 'flex', gap: 1}}>
                    <IconButton
                        disabled={!canScrollLeft}
                        size="small"
                        aria-label="Receita anterior"
                        sx={{
                            border: '1px solid rgba(0,0,0,0.08)',
                            width: 34,
                            height: 34,
                            borderRadius: '17px',
                            background: 'rgba(255,255,255,0.9)',
                            '&:hover': {
                                background: 'rgba(255,255,255,1)',
                                transform: 'scale(1.05)',
                            },
                            '&:disabled': {
                                opacity: 0.35,
                                background: 'rgba(255,255,255,0.6)',
                            },
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <ArrowBackIcon sx={{fontSize: 14, color: 'rgba(0,0,0,0.5)'}}/>
                    </IconButton>
                    <IconButton
                        disabled={!canScrollRight}
                        size="small"
                        aria-label="Próxima receita"
                        sx={{
                            border: '1px solid rgba(0,0,0,0.08)',
                            width: 34,
                            height: 34,
                            borderRadius: '17px',
                            background: 'rgba(255,255,255,0.9)',
                            '&:hover': {
                                background: 'rgba(255,255,255,1)',
                                transform: 'scale(1.05)',
                            },
                            '&:disabled': {
                                opacity: 0.35,
                                background: 'rgba(255,255,255,0.6)',
                            },
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <ArrowForwardIcon sx={{fontSize: 14, color: 'rgba(0,0,0,0.5)'}}/>
                    </IconButton>
                </Box>
            </Box>

            {/* Grid de Cards */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {xs: '1fr', md: 'repeat(2, 1fr)'},
                    gap: 3,
                }}
            >
                {recipes.slice(0, 2).map((recipe) => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onView={onViewRecipe}
                        onToggleFavorite={handleToggleFavorite}
                    />
                ))}
            </Box>
        </Paper>
    );
};

export default FeaturedRecipes;
