import React, { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FONT_PRIMARY, COLOR_ORANGE } from '@/config/constants/styles';
import RecipeCard from '@/components/HomePage/FeaturedRecipes/RecipeCard';
import { useAuth } from '@/hooks/useAuth';
import { mapRecipeToCard } from '@/lib/supabase/recipeMappers';
import {
    listFavoriteRecipes,
    toggleFavoriteRecipe,
} from '@/services/supabase/recipeService';

const FavoritesContent = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let isMounted = true;

        async function loadFavorites() {
            try {
                setIsLoading(true);
                setErrorMessage('');
                const recipes = await listFavoriteRecipes(user.id);

                if (!isMounted) return;

                setFavoriteRecipes(recipes.map((recipe) => mapRecipeToCard(recipe)));
            } catch (error) {
                if (isMounted) {
                    setErrorMessage(error.message || 'Nao foi possivel carregar as favoritas.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        if (user?.id) {
            loadFavorites();
        }

        return () => {
            isMounted = false;
        };
    }, [user?.id]);

    const handleToggleFavorite = async (recipeId, shouldFavorite) => {
        if (!shouldFavorite) {
            setFavoriteRecipes((currentRecipes) => currentRecipes.filter((recipe) => recipe.id !== recipeId));
        }

        try {
            await toggleFavoriteRecipe({
                userId: user.id,
                recipeId,
                shouldFavorite,
            });
        } catch (error) {
            setErrorMessage(error.message || 'Nao foi possivel atualizar as favoritas.');
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '9px', mt: { xs: '28px', md: '40px' } }}>
                <Box
                    component="img"
                    src="/assets/favorites/favoriteicon.png"
                    alt="Receitas Favoritas"
                    sx={{ width: 50, height: 50, objectFit: 'contain', flexShrink: 0 }}
                />
                <Box>
                    <Typography sx={{
                        fontFamily: FONT_PRIMARY,
                        fontSize: { xs: '24px', md: '30px' },
                        fontWeight: 800,
                        color: '#080C14',
                        lineHeight: { xs: '29px', md: '35px' },
                    }}>
                        Receitas Favoritas
                    </Typography>
                    <Typography sx={{
                        fontFamily: FONT_PRIMARY,
                        fontSize: { xs: '14px', md: '16px' },
                        fontWeight: 400,
                        color: '#111111',
                        lineHeight: '20px',
                    }}>
                        Suas receitas favoritas
                    </Typography>
                </Box>
            </Box>

            {errorMessage && <Alert severity="error" sx={{ mt: 3 }}>{errorMessage}</Alert>}

            {isLoading && (
                <Box sx={{ display: 'grid', placeItems: 'center', mt: '130px', mb: '130px' }}>
                    <CircularProgress sx={{ color: COLOR_ORANGE }} />
                </Box>
            )}

            {!isLoading && favoriteRecipes.length === 0 && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: '130px',
                    mb: '130px',
                    gap: 0,
                }}>
                    <Box
                        component="img"
                        src="/assets/icons/noData.png"
                        alt="Nenhuma receita favoritada"
                        sx={{ width: 86, height: 86, objectFit: 'contain', mb: '15px' }}
                    />
                    <Typography sx={{
                        fontFamily: FONT_PRIMARY,
                        fontSize: '25px',
                        fontWeight: 800,
                        color: '#202020',
                        lineHeight: '30px',
                        letterSpacing: '-0.2px',
                        textAlign: 'center',
                    }}>
                        Voce ainda nao favoritou receitas
                    </Typography>
                    <Typography sx={{
                        fontFamily: FONT_PRIMARY,
                        fontSize: '16px',
                        fontWeight: 400,
                        color: '#3E3E3E',
                        lineHeight: '20px',
                        textAlign: 'center',
                        mt: '2px',
                    }}>
                        Favorite receitas clicando no icone de coracao
                    </Typography>
                    <Button
                        onClick={() => navigate('/')}
                        disableElevation
                        disableRipple
                        sx={{
                            mt: '38px',
                            width: { xs: '100%', sm: '150px' },
                            maxWidth: '220px',
                            height: '44px',
                            backgroundColor: COLOR_ORANGE,
                            borderRadius: '6px',
                            border: 'none',
                            color: '#FFFFFF',
                            fontFamily: FONT_PRIMARY,
                            fontSize: '13px',
                            fontWeight: 500,
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: COLOR_ORANGE,
                                boxShadow: 'none',
                            },
                        }}
                    >
                        Explorar Receitas
                    </Button>
                </Box>
            )}

            {!isLoading && favoriteRecipes.length > 0 && (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: '14px', mt: { xs: '28px', md: '40px' }, mb: '80px' }}>
                    {favoriteRecipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            onToggleFavorite={handleToggleFavorite}
                            onView={(recipeId) => navigate(`/receitas/${recipeId}`)}
                        />
                    ))}
                </Box>
            )}
        </>
    );
};

export default FavoritesContent;
