import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Button, Stack, Chip, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { listRecipeCategories } from '@/services/supabase/recipeService';
import RecipePaginationControls from '@/components/Recipes/RecipePaginationControls';
import { PAGE_SIZE_OPTIONS } from '@/components/Recipes/recipeListControlOptions';
import JourneyCard from './JourneyCard';

const maxVisibleCategoryFilters = 6;

function normalizeFilter(value) {
    return (value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase();
}

export default function Journey({
    recipes = [],
    isLoading = false,
    errorMessage = '',
    onViewRecipe,
}) {
    const [activeFilter, setActiveFilter] = useState('TODAS');
    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [categoriesError, setCategoriesError] = useState('');
    const [categoryMenuAnchor, setCategoryMenuAnchor] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
    const categoryFilters = useMemo(() => ([
        { label: 'TODAS', value: 'TODAS' },
        ...categories.map((category) => ({
            label: category.name,
            value: normalizeFilter(category.name),
        })),
    ]), [categories]);
    const visibleFilters = categoryFilters.slice(0, maxVisibleCategoryFilters);
    const overflowFilters = categoryFilters.slice(maxVisibleCategoryFilters);
    const overflowActiveFilter = overflowFilters.find((filter) => filter.value === activeFilter);
    const displayedVisibleFilters = overflowActiveFilter
        ? [...visibleFilters.slice(0, -1), overflowActiveFilter]
        : visibleFilters;
    const isMenuOpen = Boolean(categoryMenuAnchor);

    useEffect(() => {
        let isMounted = true;

        async function loadCategories() {
            try {
                setIsLoadingCategories(true);
                setCategoriesError('');
                const nextCategories = await listRecipeCategories();

                if (isMounted) {
                    setCategories(nextCategories);
                }
            } catch (error) {
                if (isMounted) {
                    setCategoriesError(error.message || 'Não foi possível carregar as categorias.');
                }
            } finally {
                if (isMounted) {
                    setIsLoadingCategories(false);
                }
            }
        }

        loadCategories();

        return () => {
            isMounted = false;
        };
    }, []);

    const displayedRecipes = useMemo(() => {
        if (activeFilter === 'TODAS') return recipes;

        return recipes.filter((recipe) => (
            normalizeFilter(recipe.category) === activeFilter
        ));
    }, [activeFilter, recipes]);

    const totalPages = Math.max(1, Math.ceil(displayedRecipes.length / pageSize));
    const pageStartIndex = (currentPage - 1) * pageSize;
    const paginatedRecipes = displayedRecipes.slice(pageStartIndex, pageStartIndex + pageSize);
    const displayedStart = displayedRecipes.length === 0 ? 0 : pageStartIndex + 1;
    const displayedEnd = Math.min(pageStartIndex + pageSize, displayedRecipes.length);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter, pageSize]);

    useEffect(() => {
        setCurrentPage((page) => Math.min(page, totalPages));
    }, [totalPages]);

    const handleSelectFilter = (filterValue) => {
        setActiveFilter(filterValue);
        setCategoryMenuAnchor(null);
    };

    return (
        <Box sx={{ width: '100%', bgcolor: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'stretch', pt: '51px', pb: '36px' }}>
            <Stack alignItems="center" textAlign="center" width="100%">
                <Chip
                    label="TODAS AS RECEITAS"
                    sx={{
                        bgcolor: '#EE6352',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.6px',
                        height: 28,
                        borderRadius: '999px',
                        mb: '10px',
                        '& .MuiChip-label': { px: '14px' },
                    }}
                />
                <Typography
                    component="h2"
                    sx={{ fontSize: { xs: '36px', md: '48px' }, fontWeight: 900, lineHeight: 1.05, color: '#262522', textTransform: 'uppercase', textAlign: 'center' }}
                >
                    EMBARQUE EM
                    <br />
                    UMA JORNADA
                </Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#777570', mt: '10px' }}>
                    Descubra nossa coleção de receitas publicadas
                </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="center" gap="10px" sx={{ mt: '28px', flexWrap: 'wrap', width: '100%', maxWidth: 850, mx: 'auto' }}>
                {displayedVisibleFilters.map((filter) => {
                    const isActive = activeFilter === filter.value;
                    return (
                        <Button
                            key={filter.value}
                            onClick={() => handleSelectFilter(filter.value)}
                            disableElevation
                            disableRipple
                            sx={{
                                height: 36,
                                borderRadius: '999px',
                                fontSize: '12px',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.3px',
                                px: isActive ? '22px' : '18px',
                                minWidth: 'unset',
                                whiteSpace: 'nowrap',
                                bgcolor: isActive ? '#9FDC26' : 'transparent',
                                border: isActive ? '1px solid #262522' : '1px solid #C9C6BE',
                                color: isActive ? '#262522' : '#9A9892',
                                '&:hover': { bgcolor: isActive ? '#8fcc16' : 'rgba(0,0,0,0.04)' },
                            }}
                        >
                            {filter.label}
                        </Button>
                    );
                })}
                {overflowFilters.length > 0 && (
                    <>
                        <Button
                            onClick={(event) => setCategoryMenuAnchor(event.currentTarget)}
                            endIcon={<KeyboardArrowDownIcon fontSize="small" />}
                            disableElevation
                            disableRipple
                            sx={{
                                height: 36,
                                borderRadius: '999px',
                                fontSize: '12px',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.3px',
                                px: '18px',
                                minWidth: 'unset',
                                whiteSpace: 'nowrap',
                                bgcolor: isMenuOpen ? 'rgba(0,0,0,0.04)' : 'transparent',
                                border: '1px solid #C9C6BE',
                                color: '#9A9892',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                            }}
                        >
                            Mais
                        </Button>
                        <Menu
                            anchorEl={categoryMenuAnchor}
                            open={isMenuOpen}
                            onClose={() => setCategoryMenuAnchor(null)}
                            slotProps={{
                                paper: {
                                    sx: {
                                        maxHeight: 280,
                                        mt: 1,
                                        borderRadius: '8px',
                                    },
                                },
                            }}
                        >
                            {overflowFilters.map((filter) => (
                                <MenuItem
                                    key={filter.value}
                                    selected={activeFilter === filter.value}
                                    onClick={() => handleSelectFilter(filter.value)}
                                    sx={{ fontSize: '13px', textTransform: 'uppercase' }}
                                >
                                    {filter.label}
                                </MenuItem>
                            ))}
                        </Menu>
                    </>
                )}
            </Stack>
            {isLoadingCategories && (
                <Typography sx={{ mt: '10px', color: '#777570', fontSize: '12px', textAlign: 'center' }}>
                    Carregando categorias...
                </Typography>
            )}
            {categoriesError && (
                <Typography sx={{ mt: '10px', color: '#9F2D20', fontSize: '12px', textAlign: 'center' }}>
                    {categoriesError}
                </Typography>
            )}

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: '20px 16px', mt: '32px', width: '100%' }}>
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
                {!isLoading && !errorMessage && displayedRecipes.length === 0 && (
                    <Typography sx={{ color: '#6B6B6B', fontSize: '14px' }}>
                        Nenhuma receita encontrada para este filtro.
                    </Typography>
                )}
                {paginatedRecipes.map((recipe) => (
                    <JourneyCard
                        key={recipe.id}
                        recipe={recipe}
                        onView={() => onViewRecipe?.(recipe.id)}
                    />
                ))}
            </Box>

            {!isLoading && !errorMessage && displayedRecipes.length > 0 && (
                <RecipePaginationControls
                    bottomSpacing="0"
                    displayedEnd={displayedEnd}
                    displayedStart={displayedStart}
                    idPrefix="journey-recipes"
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                    page={currentPage}
                    pageSize={pageSize}
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                    totalItems={displayedRecipes.length}
                    totalPages={totalPages}
                />
            )}
        </Box>
    );
}
