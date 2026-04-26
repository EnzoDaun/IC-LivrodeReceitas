import React, { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    CircularProgress,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecipeCard from '@/components/HomePage/FeaturedRecipes/RecipeCard';
import { primaryNavigationLinks } from '@/config/navigation';
import { COLOR_ORANGE, FONT_PRIMARY } from '@/config/constants/styles';
import { useAuth } from '@/hooks/useAuth';
import { mapRecipeToCard } from '@/lib/supabase/recipeMappers';
import {
    listFavoriteRecipeIds,
    listPublishedRecipes,
    toggleFavoriteRecipe,
} from '@/services/supabase/recipeService';

const RecipesPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let isMounted = true;

        async function loadRecipes() {
            try {
                setIsLoading(true);
                setErrorMessage('');

                const [publishedRecipes, favoriteIds] = await Promise.all([
                    listPublishedRecipes(),
                    isAuthenticated ? listFavoriteRecipeIds(user.id) : Promise.resolve(new Set()),
                ]);

                if (!isMounted) return;

                setRecipes(publishedRecipes.map((recipe) => mapRecipeToCard({
                    ...recipe,
                    is_favorite: favoriteIds.has(recipe.id),
                })));
            } catch (error) {
                if (isMounted) {
                    setErrorMessage(error.message || 'Nao foi possivel carregar as receitas.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadRecipes();

        return () => {
            isMounted = false;
        };
    }, [isAuthenticated, user?.id]);

    const handleToggleFavorite = async (recipeId, shouldFavorite) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setRecipes((currentRecipes) => currentRecipes.map((recipe) => (
            recipe.id === recipeId
                ? { ...recipe, isFavorite: shouldFavorite }
                : recipe
        )));

        try {
            await toggleFavoriteRecipe({
                userId: user.id,
                recipeId,
                shouldFavorite,
            });
        } catch (error) {
            setErrorMessage(error.message || 'Nao foi possivel atualizar os favoritos.');
        }
    };

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', py: '28px', px: { xs: 2, md: 3 } }}>
            <Navbar links={primaryNavigationLinks} initialActiveLink="Receitas" />

            <Box sx={{ mt: '40px', mb: '28px' }}>
                <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '30px', fontWeight: 800, color: '#080C14', lineHeight: '34px' }}>
                    Receitas
                </Typography>
                <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '16px', color: '#222222', mt: '4px' }}>
                    Todas as receitas publicadas no Supabase
                </Typography>
            </Box>

            {errorMessage && <Alert severity="error" sx={{ mb: 3 }}>{errorMessage}</Alert>}

            {isLoading && (
                <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
                    <CircularProgress sx={{ color: COLOR_ORANGE }} />
                </Box>
            )}

            {!isLoading && recipes.length === 0 && (
                <Typography sx={{ fontFamily: FONT_PRIMARY, color: '#4A4A4A', my: '80px', textAlign: 'center' }}>
                    Nenhuma receita publicada ainda.
                </Typography>
            )}

            {!isLoading && recipes.length > 0 && (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: '16px', mb: '70px' }}>
                    {recipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            onView={(recipeId) => navigate(`/receitas/${recipeId}`)}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    ))}
                </Box>
            )}

            <Footer />
        </Box>
    );
};

export default RecipesPage;
