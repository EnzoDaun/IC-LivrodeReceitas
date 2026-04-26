import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/HomePage/Hero';
import FeaturedRecipes from '@/components/HomePage/FeaturedRecipes/FeaturedRecipes';
import { primaryNavigationLinks } from '@/config/navigation';
import Journey from '@/components/HomePage/Journey/Journey';
import AboutSection from '@/components/HomePage/AboutSection';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { mapRecipeToCard } from '@/lib/supabase/recipeMappers';
import {
    listFavoriteRecipeIds,
    listPublishedRecipes,
    toggleFavoriteRecipe,
} from '@/services/supabase/recipeService';

const HomePage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [recipes, setRecipes] = useState([]);
    const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
    const [recipesError, setRecipesError] = useState('');

    const handleSearch = (_query) => {};

    const handleCtaClick = () => {
        const recipesSection = document.getElementById('receitas');
        if (recipesSection) {
            recipesSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleViewRecipe = (recipeId) => {
        navigate(`/receitas/${recipeId}`);
    };

    useEffect(() => {
        let isMounted = true;

        async function loadRecipes() {
            try {
                setIsLoadingRecipes(true);
                setRecipesError('');

                const [publishedRecipes, userFavoriteIds] = await Promise.all([
                    listPublishedRecipes({ limit: 9 }),
                    isAuthenticated ? listFavoriteRecipeIds(user.id) : Promise.resolve(new Set()),
                ]);

                if (!isMounted) return;

                setRecipes(
                    publishedRecipes.map((recipe) => mapRecipeToCard({
                        ...recipe,
                        is_favorite: userFavoriteIds.has(recipe.id),
                    }))
                );
            } catch (error) {
                if (isMounted) {
                    setRecipesError(error.message || 'Nao foi possivel carregar as receitas.');
                }
            } finally {
                if (isMounted) {
                    setIsLoadingRecipes(false);
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
            setRecipesError(error.message || 'Nao foi possivel atualizar os favoritos.');
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 1100,
                mx: 'auto',
                py: '28px',
                px: { xs: 2, md: 3 },
            }}
        >
            <Navbar
                links={primaryNavigationLinks}
                onSearch={handleSearch}
                initialActiveLink="Receitas"
            />
            <Hero
                title="Livro de receitas"
                subtitle="Embarque num mundo de sabores e alegrias com receitas fantasticos usando aproveitamento integral dos alimentos"
                ctaText="Explorar Receitas"
                onCtaClick={handleCtaClick}
            />

            <Box id="receitas">
                <FeaturedRecipes
                    recipes={recipes}
                    isLoading={isLoadingRecipes}
                    errorMessage={recipesError}
                    onViewRecipe={handleViewRecipe}
                    onToggleFavorite={handleToggleFavorite}
                />
            </Box>
            {recipesError && (
                <Typography sx={{ mt: 2, color: '#9F2D20', fontSize: '14px' }}>
                    {recipesError}
                </Typography>
            )}
            <Box id="mais-vistas">
                <Journey
                    recipes={recipes}
                    isLoading={isLoadingRecipes}
                    errorMessage={recipesError}
                    onViewRecipe={handleViewRecipe}
                />
            </Box>
            <AboutSection />
            <Footer />
        </Box>
    );
};

export default HomePage;
