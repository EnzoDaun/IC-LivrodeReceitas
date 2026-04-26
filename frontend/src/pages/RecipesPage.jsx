import React, { useEffect, useMemo, useState } from 'react';
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
import RecipeFilterControls from '@/components/Recipes/RecipeFilterControls';
import RecipePaginationControls from '@/components/Recipes/RecipePaginationControls';
import {
    ALL_CATEGORIES,
    ALL_DIFFICULTIES,
    DEFAULT_RECIPE_FILTERS,
    DIFFICULTY_OPTIONS,
    PAGE_SIZE_OPTIONS,
    RECIPE_SORT_OPTIONS,
} from '@/components/Recipes/recipeListControlOptions';
import { primaryNavigationLinks } from '@/config/navigation';
import { COLOR_ORANGE, FONT_PRIMARY } from '@/config/constants/styles';
import { useAuth } from '@/hooks/useAuth';
import { mapRecipeToCard } from '@/lib/supabase/recipeMappers';
import {
    listRecipeCategories,
    listFavoriteRecipeIds,
    listPublishedRecipes,
    toggleFavoriteRecipe,
} from '@/services/supabase/recipeService';
import { normalizeSpaces } from '@/utils/validation';

function normalizeFilter(value) {
    return normalizeSpaces(value).toLocaleLowerCase('pt-BR');
}

function getTimeValue(recipe) {
    return recipe.prepTimeMinutes || Number.MAX_SAFE_INTEGER;
}

const RecipesPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState(DEFAULT_RECIPE_FILTERS);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let isMounted = true;

        async function loadRecipes() {
            try {
                setIsLoading(true);
                setErrorMessage('');

                const [publishedRecipes, recipeCategories, favoriteIds] = await Promise.all([
                    listPublishedRecipes(),
                    listRecipeCategories(),
                    isAuthenticated ? listFavoriteRecipeIds(user.id) : Promise.resolve(new Set()),
                ]);

                if (!isMounted) return;

                setCategories(recipeCategories);
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

    const filteredRecipes = useMemo(() => {
        const search = normalizeFilter(filters.search);

        const nextRecipes = recipes.filter((recipe) => {
            const matchesSearch = !search || [
                recipe.title,
                recipe.description,
                recipe.category,
                recipe.difficulty,
            ].some((value) => normalizeFilter(value).includes(search));
            const matchesCategory = filters.category === ALL_CATEGORIES || recipe.category === filters.category;
            const matchesDifficulty = filters.difficulty === ALL_DIFFICULTIES || recipe.difficulty === filters.difficulty;

            return matchesSearch && matchesCategory && matchesDifficulty;
        });

        return [...nextRecipes].sort((a, b) => {
            if (filters.sort === 'rating') {
                return b.rating - a.rating || a.title.localeCompare(b.title, 'pt-BR');
            }

            if (filters.sort === 'prepTime') {
                return getTimeValue(a) - getTimeValue(b) || a.title.localeCompare(b.title, 'pt-BR');
            }

            if (filters.sort === 'title') {
                return a.title.localeCompare(b.title, 'pt-BR');
            }

            return Date.parse(b.createdAt || 0) - Date.parse(a.createdAt || 0);
        });
    }, [filters, recipes]);

    const hasActiveFilters = filters.search
        || filters.category !== ALL_CATEGORIES
        || filters.difficulty !== ALL_DIFFICULTIES
        || filters.sort !== DEFAULT_RECIPE_FILTERS.sort;
    const totalPages = Math.max(1, Math.ceil(filteredRecipes.length / pageSize));
    const pageStartIndex = (currentPage - 1) * pageSize;
    const paginatedRecipes = filteredRecipes.slice(pageStartIndex, pageStartIndex + pageSize);
    const displayedStart = filteredRecipes.length === 0 ? 0 : pageStartIndex + 1;
    const displayedEnd = Math.min(pageStartIndex + pageSize, filteredRecipes.length);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters, pageSize]);

    useEffect(() => {
        setCurrentPage((page) => Math.min(page, totalPages));
    }, [totalPages]);

    const updateFilter = (name, value) => {
        setFilters((currentFilters) => ({
            ...currentFilters,
            [name]: value,
        }));
    };

    const handleNavbarSearch = (query) => {
        updateFilter('search', query);
    };

    const handleClearFilters = () => {
        setFilters(DEFAULT_RECIPE_FILTERS);
    };

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
            <Navbar
                links={primaryNavigationLinks}
                initialActiveLink="Receitas"
                onSearch={handleNavbarSearch}
            />

            <Box sx={{ mt: '40px', mb: '28px' }}>
                <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '30px', fontWeight: 800, color: '#080C14', lineHeight: '34px' }}>
                    Receitas
                </Typography>
                <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '16px', color: '#222222', mt: '4px' }}>
                    Todas as receitas publicadas no Supabase
                </Typography>
            </Box>

            {errorMessage && <Alert severity="error" sx={{ mb: 3 }}>{errorMessage}</Alert>}

            {!isLoading && recipes.length > 0 && (
                <RecipeFilterControls
                    categories={categories}
                    difficultyOptions={DIFFICULTY_OPTIONS}
                    filters={filters}
                    hasActiveFilters={Boolean(hasActiveFilters)}
                    idPrefix="recipes"
                    onClear={handleClearFilters}
                    onFilterChange={updateFilter}
                    sortOptions={RECIPE_SORT_OPTIONS}
                    variant="public"
                />
            )}

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
                filteredRecipes.length === 0 ? (
                    <Typography sx={{ fontFamily: FONT_PRIMARY, color: '#4A4A4A', my: '80px', textAlign: 'center' }}>
                        Nenhuma receita encontrada com os filtros selecionados.
                    </Typography>
                ) : (
                    <>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: '16px' }}>
                            {paginatedRecipes.map((recipe) => (
                                <RecipeCard
                                    key={recipe.id}
                                    recipe={recipe}
                                    onView={(recipeId) => navigate(`/receitas/${recipeId}`)}
                                    onToggleFavorite={handleToggleFavorite}
                                />
                            ))}
                        </Box>

                        <RecipePaginationControls
                            displayedEnd={displayedEnd}
                            displayedStart={displayedStart}
                            idPrefix="recipes"
                            onPageChange={setCurrentPage}
                            onPageSizeChange={setPageSize}
                            page={currentPage}
                            pageSize={pageSize}
                            pageSizeOptions={PAGE_SIZE_OPTIONS}
                            totalItems={filteredRecipes.length}
                            totalPages={totalPages}
                        />
                    </>
                )
            )}

            <Footer />
        </Box>
    );
};

export default RecipesPage;
