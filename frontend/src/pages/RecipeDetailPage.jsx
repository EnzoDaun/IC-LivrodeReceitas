import React, { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { primaryNavigationLinks } from '@/config/navigation';
import { COLOR_ORANGE, FONT_PRIMARY } from '@/config/constants/styles';
import { mapRecipeToDetail } from '@/lib/supabase/recipeMappers';
import { getRecipeById } from '@/services/supabase/recipeService';
import { getUserRating, submitRating } from '@/services/supabase/ratingService';
import { toggleFavoriteRecipe } from '@/services/supabase/recipeService';
import { useAuth } from '@/hooks/useAuth';

// ── Componente: exibição de estrelas (somente leitura) ─────────────────────
const StarDisplay = ({ rating, count }) => {
    const filled = Math.round(rating);
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '10px' }}>
            <Box sx={{ display: 'flex', gap: '2px' }}>
                {Array.from({ length: 5 }, (_, i) => (
                    <Box
                        key={i}
                        component="svg"
                        viewBox="0 0 24 24"
                        sx={{ width: 18, height: 18, flexShrink: 0 }}
                        fill={i < filled ? '#F29F05' : 'none'}
                        stroke={i < filled ? '#F29F05' : '#C9C0B4'}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </Box>
                ))}
            </Box>
            <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '13px', color: '#555555', lineHeight: 1 }}>
                {rating > 0 ? rating.toFixed(1) : '—'}
                {count > 0 && (
                    <Box component="span" sx={{ color: '#9A958D', ml: '4px' }}>
                        ({count} {count === 1 ? 'avaliação' : 'avaliações'})
                    </Box>
                )}
            </Typography>
        </Box>
    );
};

// ── Componente: seletor de estrelas (interativo) ───────────────────────────
const StarPicker = ({ value, onChange }) => {
    const [hovered, setHovered] = useState(0);
    return (
        <Box sx={{ display: 'flex', gap: '6px', justifyContent: 'center', mt: '8px' }}>
            {Array.from({ length: 5 }, (_, i) => {
                const star = i + 1;
                const active = star <= (hovered || value);
                return (
                    <Box
                        key={star}
                        component="svg"
                        viewBox="0 0 24 24"
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => onChange(star)}
                        sx={{
                            width: 36,
                            height: 36,
                            cursor: 'pointer',
                            flexShrink: 0,
                            transition: 'transform 0.1s',
                            '&:hover': { transform: 'scale(1.15)' },
                        }}
                        fill={active ? '#F29F05' : 'none'}
                        stroke={active ? '#F29F05' : '#C9C0B4'}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </Box>
                );
            })}
        </Box>
    );
};

// ── Página principal ───────────────────────────────────────────────────────
const RecipeDetailPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { recipeId } = useParams();
    const { isAuthenticated, user } = useAuth();

    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    // progresso nas etapas
    const [currentStep, setCurrentStep] = useState(0);
    const [recipeFinished, setRecipeFinished] = useState(false);

    // dialogs
    const [confirmStepOpen, setConfirmStepOpen] = useState(false);
    const [confirmFinishOpen, setConfirmFinishOpen] = useState(false);
    const [ratingDialogOpen, setRatingDialogOpen] = useState(false);

    // avaliação
    const [selectedRating, setSelectedRating] = useState(0);
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);
    const [ratingError, setRatingError] = useState('');
    const [ratingSubmitted, setRatingSubmitted] = useState(false);
    const [ratingFromLogin, setRatingFromLogin] = useState(false);
    const [favoriteDialogOpen, setFavoriteDialogOpen] = useState(false);
    const [hasRated, setHasRated] = useState(false);

    useEffect(() => {
        let isMounted = true;
        async function loadRecipe() {
            try {
                setIsLoading(true);
                setErrorMessage('');
                const data = await getRecipeById(recipeId);
                if (isMounted) setRecipe(mapRecipeToDetail(data));
            } catch (error) {
                if (isMounted) setErrorMessage(error.message || 'Nao foi possivel carregar a receita.');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        loadRecipe();
        return () => { isMounted = false; };
    }, [recipeId]);

    // ── verificar se usuário já avaliou esta receita ──────────────────────
    useEffect(() => {
        if (!recipe || !isAuthenticated || !user?.id) return;
        getUserRating({ recipeId, userId: user.id })
            .then((rating) => { if (rating !== null) setHasRated(true); })
            .catch(() => {});
    }, [recipe, isAuthenticated, user?.id, recipeId]);

    // ── auto-abrir dialog após retorno do login ────────────────────────────
    useEffect(() => {
        if (!recipe || !location.state?.pendingRating) return;
        navigate('.', { replace: true, state: {} });

        if (!isAuthenticated || !user?.id) {
            setRatingFromLogin(true);
            setRatingDialogOpen(true);
            return;
        }

        getUserRating({ recipeId, userId: user.id })
            .then((rating) => {
                if (rating !== null) {
                    setHasRated(true);
                    return; // já avaliou — não abre o dialog
                }
                setRatingFromLogin(true);
                setRatingDialogOpen(true);
            })
            .catch(() => {
                setRatingFromLogin(true);
                setRatingDialogOpen(true);
            });
    }, [recipe, location.state?.pendingRating]);

    // ── handlers etapas ───────────────────────────────────────────────────
    const isLastStep = recipe && currentStep === recipe.steps.length - 1;

    const handleStepButtonClick = () => {
        if (isLastStep) {
            setConfirmFinishOpen(true);
        } else {
            setConfirmStepOpen(true);
        }
    };

    const handleConfirmStep = () => {
        setConfirmStepOpen(false);
        setCurrentStep((s) => s + 1);
    };

    const handleConfirmFinish = () => {
        setConfirmFinishOpen(false);
        setRecipeFinished(true);
        if (isAuthenticated && hasRated) return; // já avaliou — não abre dialog
        setRatingDialogOpen(true);
    };

    // ── handlers avaliação ────────────────────────────────────────────────
    const handleSubmitRating = async () => {
        if (!selectedRating || !isAuthenticated) return;
        try {
            setIsSubmittingRating(true);
            setRatingError('');
            await submitRating({ recipeId, userId: user.id, rating: selectedRating });
            setRatingSubmitted(true);
            if (selectedRating >= 3) {
                setTimeout(() => {
                    setRatingDialogOpen(false);
                    setFavoriteDialogOpen(true);
                }, 1000);
            } else {
                setTimeout(() => setRatingDialogOpen(false), 1200);
            }
        } catch (error) {
            setRatingError(error.message || 'Nao foi possivel enviar a avaliacao.');
        } finally {
            setIsSubmittingRating(false);
        }
    };

    const handleConfirmFavorite = async () => {
        setFavoriteDialogOpen(false);
        try {
            await toggleFavoriteRecipe({ userId: user.id, recipeId, shouldFavorite: true });
        } catch {
            // silencia erro — favorito é uma ação secundária
        }
    };

    const handleCloseRatingDialog = () => {
        setRatingDialogOpen(false);
        setSelectedRating(0);
        setRatingError('');
        setRatingSubmitted(false);
        setRatingFromLogin(false);
    };

    // ── estilos do círculo de etapa ───────────────────────────────────────
    const getStepCircleStyle = (index) => {
        if (index < currentStep) {
            return { backgroundColor: '#E0DBD5', color: '#9A958D' };
        }
        if (index === currentStep) {
            return { backgroundColor: COLOR_ORANGE, color: '#FFFFFF' };
        }
        return { backgroundColor: 'transparent', color: '#C9C0B4', border: '1px solid #C9C0B4' };
    };

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', py: '28px', px: { xs: 2, md: 3 } }}>
            <Navbar links={primaryNavigationLinks} initialActiveLink="Receitas" />

            {isLoading && (
                <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 420 }}>
                    <CircularProgress sx={{ color: COLOR_ORANGE }} />
                </Box>
            )}

            {!isLoading && errorMessage && (
                <Alert severity="error" sx={{ mt: '40px' }}>{errorMessage}</Alert>
            )}

            {!isLoading && recipe && (
                <Box sx={{ mt: '40px', mb: '70px' }}>
                    <Button
                        onClick={() => navigate(-1)}
                        sx={{ color: '#2D2D2D', fontFamily: FONT_PRIMARY, fontWeight: 700, textTransform: 'none', mb: '18px' }}
                    >
                        Voltar
                    </Button>

                    {/* ── Imagem + Info ─────────────────────────────────── */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' }, gap: '28px', alignItems: 'start' }}>
                        <Box
                            component="img"
                            src={recipe.imageUrl}
                            alt={recipe.title}
                            sx={{ width: '100%', height: { xs: 280, md: 460 }, objectFit: 'cover', borderRadius: '10px', boxShadow: '0px 8px 24px rgba(0,0,0,0.10)' }}
                        />

                        <Box>
                            <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: { xs: '32px', md: '42px' }, fontWeight: 900, color: '#171717', lineHeight: 1.1 }}>
                                {recipe.title}
                            </Typography>
                            <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '15px', color: '#555555', lineHeight: 1.7, mt: '14px' }}>
                                {recipe.description}
                            </Typography>

                            {/* ── Média de estrelas ─────────────────────── */}
                            <StarDisplay rating={recipe.rating} count={recipe.ratingCount} />

                            <Stack direction="row" gap="10px" sx={{ flexWrap: 'wrap', mt: '18px' }}>
                                {[recipe.category || 'Sem categoria', recipe.difficulty, recipe.prepTime, recipe.portions].map((item) => (
                                    <Box
                                        key={item}
                                        sx={{
                                            px: '12px', py: '7px', borderRadius: '999px',
                                            border: '1px solid #C9C0B4', fontFamily: FONT_PRIMARY,
                                            fontSize: '12px', fontWeight: 800, textTransform: 'uppercase',
                                        }}
                                    >
                                        {item}
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    </Box>

                    {/* ── Ingredientes + Preparo ────────────────────────── */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '0.9fr 1.1fr' }, gap: '22px', mt: '32px' }}>
                        <Paper elevation={0} sx={{ p: '22px', borderRadius: '8px', backgroundColor: '#FFFBF2' }}>
                            <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '22px', fontWeight: 900, color: '#222222', mb: '16px' }}>
                                Ingredientes
                            </Typography>
                            <Stack divider={<Divider flexItem />} gap="10px">
                                {recipe.ingredients.length === 0 && (
                                    <Typography sx={{ color: '#666666' }}>Nenhum ingrediente cadastrado.</Typography>
                                )}
                                {recipe.ingredients.map((ingredient) => (
                                    <Typography key={ingredient.id} sx={{ fontFamily: FONT_PRIMARY, fontSize: '14px', color: '#2D2D2D', py: '4px' }}>
                                        {ingredient.content}
                                    </Typography>
                                ))}
                            </Stack>
                        </Paper>

                        <Paper elevation={0} sx={{ p: '22px', borderRadius: '8px', backgroundColor: '#FFFFFF', boxShadow: '0px 3px 13px rgba(0,0,0,0.08)' }}>
                            <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '22px', fontWeight: 900, color: '#222222', mb: '16px' }}>
                                Preparo
                            </Typography>
                            <Stack gap="14px">
                                {recipe.steps.length === 0 && (
                                    <Typography sx={{ color: '#666666' }}>Nenhuma instrucao cadastrada.</Typography>
                                )}
                                {recipe.steps.map((step, index) => {
                                    const completed = index < currentStep;
                                    const current = index === currentStep;
                                    return (
                                        <Box key={step.id} sx={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: '12px', alignItems: 'start' }}>
                                            <Box sx={{
                                                width: 28, height: 28, borderRadius: '50%',
                                                display: 'grid', placeItems: 'center',
                                                fontWeight: 800, fontSize: '13px', flexShrink: 0,
                                                mt: '2px',
                                                ...getStepCircleStyle(index),
                                            }}>
                                                {index + 1}
                                            </Box>
                                            <Typography
                                                component={completed ? 's' : 'p'}
                                                sx={{
                                                    fontFamily: FONT_PRIMARY,
                                                    fontSize: '14px',
                                                    lineHeight: 1.6,
                                                    color: completed ? '#9A958D' : current ? '#171717' : '#555555',
                                                    fontWeight: current ? 600 : 400,
                                                    m: 0,
                                                    transition: 'color 0.2s',
                                                }}
                                            >
                                                {step.content}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Stack>

                            {/* ── Botão de progresso ─────────────────────── */}
                            {recipe.steps.length > 0 && !recipeFinished && (
                                <Box sx={{ mt: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleStepButtonClick}
                                        sx={{
                                            backgroundColor: isLastStep ? '#F05E46' : COLOR_ORANGE,
                                            color: '#FFFFFF',
                                            fontFamily: FONT_PRIMARY,
                                            fontWeight: 700,
                                            fontSize: '13px',
                                            textTransform: 'none',
                                            borderRadius: '8px',
                                            px: '20px',
                                            py: '10px',
                                            boxShadow: 'none',
                                            '&:hover': {
                                                backgroundColor: isLastStep ? '#d9533e' : '#F2C442',
                                                boxShadow: 'none',
                                            },
                                        }}
                                    >
                                        {isLastStep
                                            ? 'Finalizar receita'
                                            : `Marcar etapa ${currentStep + 1} como concluída`}
                                    </Button>
                                </Box>
                            )}

                            {recipeFinished && (
                                <Box sx={{ mt: '24px', p: '12px', borderRadius: '8px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', textAlign: 'center' }}>
                                    <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '14px', color: '#15803D', fontWeight: 600 }}>
                                        🎉 Receita concluída!
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Box>
                </Box>
            )}

            {/* ── Dialog: confirmar avançar etapa ──────────────────────── */}
            <Dialog
                open={confirmStepOpen}
                onClose={() => setConfirmStepOpen(false)}
                maxWidth="xs"
                fullWidth
                slotProps={{ paper: { sx: { borderRadius: '16px', px: 1 } } }}
            >
                <DialogTitle sx={{ fontFamily: FONT_PRIMARY, fontWeight: 700, fontSize: '17px', pb: 1 }}>
                    Confirmar etapa
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontFamily: FONT_PRIMARY, fontSize: '14px', color: '#667085' }}>
                        Deseja concluir a etapa de preparo e avançar para a próxima?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button
                        onClick={() => setConfirmStepOpen(false)}
                        variant="outlined"
                        sx={{ borderRadius: '8px', textTransform: 'none', fontFamily: FONT_PRIMARY, fontWeight: 500, borderColor: '#CEC7BA', color: '#667085', '&:hover': { borderColor: '#667085', backgroundColor: 'transparent' } }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmStep}
                        variant="contained"
                        sx={{ borderRadius: '8px', textTransform: 'none', fontFamily: FONT_PRIMARY, fontWeight: 600, backgroundColor: COLOR_ORANGE, boxShadow: 'none', '&:hover': { backgroundColor: '#F2C442', boxShadow: 'none' } }}
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Dialog: confirmar finalizar receita ───────────────────── */}
            <Dialog
                open={confirmFinishOpen}
                onClose={() => setConfirmFinishOpen(false)}
                maxWidth="xs"
                fullWidth
                slotProps={{ paper: { sx: { borderRadius: '16px', px: 1 } } }}
            >
                <DialogTitle sx={{ fontFamily: FONT_PRIMARY, fontWeight: 700, fontSize: '17px', pb: 1 }}>
                    Finalizar receita
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontFamily: FONT_PRIMARY, fontSize: '14px', color: '#667085' }}>
                        Deseja Finalizar a receita?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button
                        onClick={() => setConfirmFinishOpen(false)}
                        variant="outlined"
                        sx={{ borderRadius: '8px', textTransform: 'none', fontFamily: FONT_PRIMARY, fontWeight: 500, borderColor: '#CEC7BA', color: '#667085', '&:hover': { borderColor: '#667085', backgroundColor: 'transparent' } }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmFinish}
                        variant="contained"
                        sx={{ borderRadius: '8px', textTransform: 'none', fontFamily: FONT_PRIMARY, fontWeight: 600, backgroundColor: '#F05E46', boxShadow: 'none', '&:hover': { backgroundColor: '#d9533e', boxShadow: 'none' } }}
                    >
                        Finalizar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Dialog: avaliar receita ───────────────────────────────── */}
            <Dialog
                open={ratingDialogOpen}
                onClose={handleCloseRatingDialog}
                maxWidth="xs"
                fullWidth
                slotProps={{ paper: { sx: { borderRadius: '16px', px: 1 } } }}
            >
                <DialogTitle sx={{ fontFamily: FONT_PRIMARY, fontWeight: 700, fontSize: '17px', pb: 0, textAlign: 'center', lineHeight: 1.3 }}>
                    {ratingFromLogin
                        ? `Agora você pode avaliar a última receita que concluiu!: ${recipe?.title}`
                        : 'Agora você pode avaliar a receita!'}
                </DialogTitle>
                <DialogContent sx={{ pb: 1, textAlign: 'center' }}>
                    {ratingSubmitted ? (
                        <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '15px', color: '#15803D', fontWeight: 600, mt: '12px' }}>
                            ✅ Avaliação enviada! Obrigado.
                        </Typography>
                    ) : (
                        <>
                            <DialogContentText sx={{ fontFamily: FONT_PRIMARY, fontSize: '14px', color: '#667085', mt: '6px' }}>
                                {isAuthenticated
                                    ? 'Selecione quantas estrelas esta receita merece:'
                                    : (
                                        <>
                                            <Box
                                                component="span"
                                                onClick={() => navigate('/login', {
                                                    state: {
                                                        from: { pathname: `/receitas/${recipeId}` },
                                                        pendingRating: recipe?.title,
                                                    },
                                                })}
                                                sx={{ color: '#F29F05', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', '&:hover': { color: '#F2C442' } }}
                                            >
                                                Faça login ou registre-se
                                            </Box>
                                            {' para avaliar esta receita!'}
                                        </>
                                    )}
                            </DialogContentText>
                            {isAuthenticated && (
                                <StarPicker value={selectedRating} onChange={setSelectedRating} />
                            )}
                            {ratingError && (
                                <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '13px', color: '#B42318', mt: '10px' }}>
                                    {ratingError}
                                </Typography>
                            )}
                        </>
                    )}
                </DialogContent>
                {!ratingSubmitted && (
                    <DialogActions sx={{ px: 3, pb: 2.5, gap: 1, justifyContent: 'center' }}>
                        <Button
                            onClick={handleCloseRatingDialog}
                            variant="outlined"
                            sx={{ borderRadius: '8px', textTransform: 'none', fontFamily: FONT_PRIMARY, fontWeight: 500, borderColor: '#CEC7BA', color: '#667085', '&:hover': { borderColor: '#667085', backgroundColor: 'transparent' } }}
                        >
                            {isAuthenticated ? 'Pular' : 'Fechar'}
                        </Button>
                        {isAuthenticated && (
                            <Button
                                onClick={handleSubmitRating}
                                variant="contained"
                                disabled={!selectedRating || isSubmittingRating}
                                sx={{ borderRadius: '8px', textTransform: 'none', fontFamily: FONT_PRIMARY, fontWeight: 600, backgroundColor: COLOR_ORANGE, boxShadow: 'none', '&:hover': { backgroundColor: '#F2C442', boxShadow: 'none' } }}
                            >
                                {isSubmittingRating ? <CircularProgress size={16} sx={{ color: '#FFFFFF' }} /> : 'Enviar avaliação'}
                            </Button>
                        )}
                    </DialogActions>
                )}
            </Dialog>

            {/* ── Dialog: adicionar aos favoritos ──────────────────────── */}
            <Dialog
                open={favoriteDialogOpen}
                onClose={() => setFavoriteDialogOpen(false)}
                maxWidth="xs"
                fullWidth
                slotProps={{ paper: { sx: { borderRadius: '16px', px: 1 } } }}
            >
                <DialogTitle sx={{ fontFamily: FONT_PRIMARY, fontWeight: 700, fontSize: '17px', pb: 1 }}>
                    Que bom que gostou da receita!
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontFamily: FONT_PRIMARY, fontSize: '14px', color: '#667085' }}>
                        Deseja adicioná-la também aos favoritos?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button
                        onClick={() => setFavoriteDialogOpen(false)}
                        variant="outlined"
                        sx={{ borderRadius: '8px', textTransform: 'none', fontFamily: FONT_PRIMARY, fontWeight: 500, borderColor: '#CEC7BA', color: '#667085', '&:hover': { borderColor: '#667085', backgroundColor: 'transparent' } }}
                    >
                        Não
                    </Button>
                    <Button
                        onClick={handleConfirmFavorite}
                        variant="contained"
                        sx={{ borderRadius: '8px', textTransform: 'none', fontFamily: FONT_PRIMARY, fontWeight: 600, backgroundColor: '#F05E46', boxShadow: 'none', '&:hover': { backgroundColor: '#d9533e', boxShadow: 'none' } }}
                    >
                        Sim
                    </Button>
                </DialogActions>
            </Dialog>

            <Footer />
        </Box>
    );
};

export default RecipeDetailPage;
