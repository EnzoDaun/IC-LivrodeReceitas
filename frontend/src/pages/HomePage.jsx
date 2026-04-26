import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
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
    listTopRatedPublishedRecipes,
    toggleFavoriteRecipe,
} from '@/services/supabase/recipeService';

const HomePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();
    const [featuredRecipes, setFeaturedRecipes] = useState([]);
    const [journeyRecipes, setJourneyRecipes] = useState([]);
    const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
    const [recipesError, setRecipesError] = useState('');

    useEffect(() => {
        const scrollTarget = location.state?.scrollTo;
        if (!scrollTarget) return;
        navigate('.', { replace: true, state: {} });
        setTimeout(() => {
            document.getElementById(scrollTarget)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }, [location.state?.scrollTo]);

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

                const [topRated, allPublished, userFavoriteIds] = await Promise.all([
                    listTopRatedPublishedRecipes({ limit: 6 }),
                    listPublishedRecipes(),
                    isAuthenticated ? listFavoriteRecipeIds(user.id) : Promise.resolve(new Set()),
                ]);

                if (!isMounted) return;

                const toCard = (recipe) => mapRecipeToCard({
                    ...recipe,
                    is_favorite: userFavoriteIds.has(recipe.id),
                });

                setFeaturedRecipes(topRated.map(toCard));
                setJourneyRecipes(allPublished.map(toCard));
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

    const toggleInList = (setter) => (recipeId, shouldFavorite) => {
        setter((current) => current.map((r) => (
            r.id === recipeId ? { ...r, isFavorite: shouldFavorite } : r
        )));
    };

    const handleToggleFavorite = async (recipeId, shouldFavorite) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        toggleInList(setFeaturedRecipes)(recipeId, shouldFavorite);
        toggleInList(setJourneyRecipes)(recipeId, shouldFavorite);

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
                    recipes={featuredRecipes}
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
                    recipes={journeyRecipes}
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
