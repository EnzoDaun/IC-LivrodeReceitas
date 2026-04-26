import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RecipeFilterControls from '@/components/Recipes/RecipeFilterControls';
import RecipePaginationControls from '@/components/Recipes/RecipePaginationControls';
import {
    ADMIN_STATUS_OPTIONS,
    ALL_CATEGORIES,
    ALL_DIFFICULTIES,
    ALL_STATUSES,
    DEFAULT_ADMIN_RECIPE_FILTERS,
    DIFFICULTY_OPTIONS,
    PAGE_SIZE_OPTIONS,
    RECIPE_SORT_OPTIONS,
} from '@/components/Recipes/recipeListControlOptions';
import { FONT_PRIMARY, COLOR_ORANGE } from '@/config/constants/styles';
import { useAuth } from '@/hooks/useAuth';
import { mapDashboardStats } from '@/lib/supabase/recipeMappers';
import { deleteRecipe, listManagedRecipes, listRecipeCategories } from '@/services/supabase/recipeService';
import { normalizeSpaces } from '@/utils/validation';

const defaultStats = [
    { label: 'Total de receitas', value: '0', description: 'Receitas publicadas' },
    { label: 'Media de avaliacoes', value: '0.0', description: 'De 5 estrelas' },
    { label: 'Reviews totais', value: '0', description: 'Reservado para proximas iteracoes' },
];

const orangeBtn = {
    backgroundColor: COLOR_ORANGE,
    borderRadius: '6px',
    color: '#FFFFFF',
    fontFamily: FONT_PRIMARY,
    fontSize: '13px',
    fontWeight: 500,
    textTransform: 'none',
    boxShadow: 'none',
    border: 'none',
    minWidth: 'unset',
    whiteSpace: 'nowrap',
    '&:hover': { backgroundColor: COLOR_ORANGE, boxShadow: 'none' },
};

const secondaryBtn = {
    borderRadius: '6px',
    fontFamily: FONT_PRIMARY,
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'none',
    minWidth: 'unset',
};

function normalizeFilter(value) {
    return normalizeSpaces(value).toLocaleLowerCase('pt-BR');
}

function getTimeValue(recipe) {
    return Number(recipe.prep_time_minutes || 0) || Number.MAX_SAFE_INTEGER;
}

function StatCard({ label, value, description }) {
    return (
        <Paper elevation={0} sx={{
            flex: 1,
            borderRadius: '9px',
            boxShadow: '0px 3px 13px rgba(0,0,0,0.10)',
            backgroundColor: '#FEFEFD',
            p: '20px 18px',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '22px', fontWeight: 800, color: '#2A2A2A', lineHeight: '26px' }}>
                {label}
            </Typography>
            <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '48px', fontWeight: 800, color: COLOR_ORANGE, lineHeight: '58px', mt: '16px' }}>
                {value}
            </Typography>
            <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '15px', fontWeight: 400, color: '#4A4A4A', lineHeight: '20px', mt: '10px' }}>
                {description}
            </Typography>
        </Paper>
    );
}

const ChefDashboard = () => {
    const navigate = useNavigate();
    const { isAdmin, profile, user } = useAuth();
    const [stats, setStats] = useState(defaultStats);
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState(DEFAULT_ADMIN_RECIPE_FILTERS);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const goToAddRecipe = () => navigate('/receitas/adicionar');
    const goToEditRecipe = (recipeId) => navigate(`/receitas/${recipeId}/editar`);
    const closeDeleteDialog = () => {
        if (!isDeleting) {
            setRecipeToDelete(null);
        }
    };

    const handleConfirmDelete = async () => {
        if (!recipeToDelete) return;

        try {
            setIsDeleting(true);
            setErrorMessage('');
            await deleteRecipe(recipeToDelete.id);

            const nextRecipes = recipes.filter((recipe) => recipe.id !== recipeToDelete.id);
            setRecipes(nextRecipes);
            setStats(mapDashboardStats(nextRecipes));
            setRecipeToDelete(null);
        } catch (error) {
            setErrorMessage(error.message || 'Nao foi possivel excluir a receita.');
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        async function loadDashboard() {
            try {
                setIsLoading(true);
                setErrorMessage('');
                const [nextRecipes, recipeCategories] = await Promise.all([
                    listManagedRecipes({
                        userId: user.id,
                        isAdmin,
                    }),
                    listRecipeCategories(),
                ]);

                if (!isMounted) return;

                setCategories(recipeCategories);
                setRecipes(nextRecipes);
                setStats(mapDashboardStats(nextRecipes));
            } catch (error) {
                if (isMounted) {
                    setErrorMessage(error.message || 'Nao foi possivel carregar o painel.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        if (user?.id) {
            loadDashboard();
        }

        return () => {
            isMounted = false;
        };
    }, [isAdmin, user?.id]);

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
            const matchesStatus = filters.status === ALL_STATUSES
                || (filters.status === 'published' && recipe.is_published)
                || (filters.status === 'draft' && !recipe.is_published);

            return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
        });

        return [...nextRecipes].sort((a, b) => {
            if (filters.sort === 'rating') {
                return Number(b.average_rating || 0) - Number(a.average_rating || 0)
                    || a.title.localeCompare(b.title, 'pt-BR');
            }

            if (filters.sort === 'prepTime') {
                return getTimeValue(a) - getTimeValue(b)
                    || a.title.localeCompare(b.title, 'pt-BR');
            }

            if (filters.sort === 'title') {
                return a.title.localeCompare(b.title, 'pt-BR');
            }

            return Date.parse(b.created_at || 0) - Date.parse(a.created_at || 0);
        });
    }, [filters, recipes]);

    const hasActiveFilters = filters.search
        || filters.category !== ALL_CATEGORIES
        || filters.difficulty !== ALL_DIFFICULTIES
        || filters.status !== ALL_STATUSES
        || filters.sort !== DEFAULT_ADMIN_RECIPE_FILTERS.sort;
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

    const handleClearFilters = () => {
        setFilters(DEFAULT_ADMIN_RECIPE_FILTERS);
    };

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '9px', mt: '40px' }}>
                <Box
                    component="img"
                    src="/assets/icons/chefIcon.png"
                    alt="Painel do chef"
                    sx={{ width: 44, height: 44, objectFit: 'contain', flexShrink: 0 }}
                />
                <Box>
                    <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '30px', fontWeight: 800, color: '#080C14', lineHeight: '34px', letterSpacing: '-0.5px' }}>
                        Painel do chef
                    </Typography>
                    <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '16px', fontWeight: 400, color: '#222222', lineHeight: '18px' }}>
                        {`Bem vindo${profile?.full_name ? `, ${profile.full_name}` : ''}!`}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: '30px', mt: '32px' }}>
                {stats.map((s) => (
                    <StatCard key={s.label} {...s} />
                ))}
            </Box>

            <Paper elevation={0} sx={{
                mt: '28px',
                width: '100%',
                height: '84px',
                borderRadius: '9px',
                boxShadow: '0px 3px 13px rgba(0,0,0,0.08)',
                backgroundColor: '#FEFEFD',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: '18px',
                boxSizing: 'border-box',
            }}>
                <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '24px', fontWeight: 800, color: '#2A2A2A', lineHeight: '30px' }}>
                    Receitas cadastradas
                </Typography>
                <Button disableElevation disableRipple onClick={goToAddRecipe} sx={{ ...orangeBtn, width: '168px', height: '42px' }}>
                    + Adicionar Nova Receita
                </Button>
            </Paper>

            {errorMessage && <Alert severity="error" sx={{ mt: 3 }}>{errorMessage}</Alert>}

            {!isLoading && recipes.length > 0 && (
                <RecipeFilterControls
                    categories={categories}
                    difficultyOptions={DIFFICULTY_OPTIONS}
                    filters={filters}
                    hasActiveFilters={Boolean(hasActiveFilters)}
                    idPrefix="admin-recipes"
                    onClear={handleClearFilters}
                    onFilterChange={updateFilter}
                    sortOptions={RECIPE_SORT_OPTIONS}
                    statusOptions={ADMIN_STATUS_OPTIONS}
                    variant="admin"
                />
            )}

            {isLoading && (
                <Box sx={{ display: 'grid', placeItems: 'center', mt: '72px', mb: '60px' }}>
                    <CircularProgress sx={{ color: COLOR_ORANGE }} />
                </Box>
            )}

            {!isLoading && recipes.length === 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: '72px', mb: '60px' }}>
                    <Box
                        component="img"
                        src="/assets/icons/noData.png"
                        alt="Nenhuma receita adicionada"
                        sx={{ width: 70, height: 69, objectFit: 'contain', mb: '16px' }}
                    />
                    <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '24px', fontWeight: 800, color: '#242424', lineHeight: '30px', textAlign: 'center' }}>
                        Voce ainda nao adicionou receitas
                    </Typography>
                    <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '15px', fontWeight: 400, color: '#4A4A4A', lineHeight: '17px', textAlign: 'center', mt: '6px' }}>
                        Vamos comecar adicionando
                        <br />
                        algumas receitas!
                    </Typography>
                    <Button disableElevation disableRipple onClick={goToAddRecipe} sx={{ ...orangeBtn, width: '174px', height: '42px', mt: '24px' }}>
                        + Adicionar Nova Receita
                    </Button>
                </Box>
            )}

            {!isLoading && recipes.length > 0 && (
                filteredRecipes.length === 0 ? (
                    <Typography sx={{ fontFamily: FONT_PRIMARY, color: '#4A4A4A', my: '72px', textAlign: 'center' }}>
                        Nenhuma receita encontrada com os filtros selecionados.
                    </Typography>
                ) : (
                    <>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: '18px', mt: '28px' }}>
                            {paginatedRecipes.map((recipe) => (
                                <Paper key={recipe.id} elevation={0} sx={{ borderRadius: '12px', p: '18px', boxShadow: '0px 3px 13px rgba(0,0,0,0.08)' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                                        <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '18px', fontWeight: 800, color: '#2A2A2A' }}>
                                            {recipe.title}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                            <Button
                                                disableElevation
                                                onClick={() => goToEditRecipe(recipe.id)}
                                                sx={{
                                                    ...secondaryBtn,
                                                    px: '10px',
                                                    height: '32px',
                                                    color: COLOR_ORANGE,
                                                    border: `1px solid ${COLOR_ORANGE}`,
                                                }}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                disableElevation
                                                onClick={() => setRecipeToDelete(recipe)}
                                                sx={{
                                                    ...secondaryBtn,
                                                    px: '10px',
                                                    height: '32px',
                                                    color: '#B42318',
                                                    border: '1px solid #F0A8A0',
                                                    backgroundColor: '#FFF7F5',
                                                    '&:hover': { backgroundColor: '#FFEDEA' },
                                                }}
                                            >
                                                Excluir
                                            </Button>
                                        </Box>
                                    </Box>
                                    <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '13px', color: '#4A4A4A', mt: '8px' }}>
                                        {recipe.description || 'Sem descricao cadastrada.'}
                                    </Typography>
                                    <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '12px', fontWeight: 700, color: COLOR_ORANGE, mt: '12px', textTransform: 'uppercase' }}>
                                        {`${recipe.category || 'Sem categoria'} · ${recipe.difficulty || 'Sem nivel'} · ${recipe.prep_time_minutes || 0} min`}
                                    </Typography>
                                </Paper>
                            ))}
                        </Box>

                        <RecipePaginationControls
                            bottomSpacing="60px"
                            displayedEnd={displayedEnd}
                            displayedStart={displayedStart}
                            idPrefix="admin-recipes"
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

            <Dialog open={Boolean(recipeToDelete)} onClose={closeDeleteDialog} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontFamily: FONT_PRIMARY, fontWeight: 800 }}>
                    Excluir receita?
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '14px', color: '#333333' }}>
                        {`Tem certeza que deseja excluir "${recipeToDelete?.title || 'esta receita'}"? Essa acao nao pode ser desfeita.`}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={closeDeleteDialog}
                        disabled={isDeleting}
                        sx={{ ...secondaryBtn, color: '#333333' }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        disabled={isDeleting}
                        sx={{
                            ...secondaryBtn,
                            backgroundColor: '#B42318',
                            color: '#FFFFFF',
                            px: '14px',
                            '&:hover': { backgroundColor: '#981B12' },
                        }}
                    >
                        {isDeleting ? 'Excluindo...' : 'Excluir'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ChefDashboard;
