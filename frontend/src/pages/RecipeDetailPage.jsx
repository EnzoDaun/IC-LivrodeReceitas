import React, { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { primaryNavigationLinks } from '@/config/navigation';
import { COLOR_ORANGE, FONT_PRIMARY } from '@/config/constants/styles';
import { mapRecipeToDetail } from '@/lib/supabase/recipeMappers';
import { getRecipeById } from '@/services/supabase/recipeService';

const RecipeDetailPage = () => {
    const navigate = useNavigate();
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let isMounted = true;

        async function loadRecipe() {
            try {
                setIsLoading(true);
                setErrorMessage('');
                const data = await getRecipeById(recipeId);

                if (isMounted) {
                    setRecipe(mapRecipeToDetail(data));
                }
            } catch (error) {
                if (isMounted) {
                    setErrorMessage(error.message || 'Nao foi possivel carregar a receita.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadRecipe();

        return () => {
            isMounted = false;
        };
    }, [recipeId]);

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', py: '28px', px: { xs: 2, md: 3 } }}>
            <Navbar links={primaryNavigationLinks} initialActiveLink="Receitas" />

            {isLoading && (
                <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 420 }}>
                    <CircularProgress sx={{ color: COLOR_ORANGE }} />
                </Box>
            )}

            {!isLoading && errorMessage && (
                <Alert severity="error" sx={{ mt: '40px' }}>
                    {errorMessage}
                </Alert>
            )}

            {!isLoading && recipe && (
                <Box sx={{ mt: '40px', mb: '70px' }}>
                    <Button
                        onClick={() => navigate(-1)}
                        sx={{
                            color: '#2D2D2D',
                            fontFamily: FONT_PRIMARY,
                            fontWeight: 700,
                            textTransform: 'none',
                            mb: '18px',
                        }}
                    >
                        Voltar
                    </Button>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' }, gap: '28px', alignItems: 'start' }}>
                        <Box
                            component="img"
                            src={recipe.imageUrl}
                            alt={recipe.title}
                            sx={{
                                width: '100%',
                                height: { xs: 280, md: 460 },
                                objectFit: 'cover',
                                borderRadius: '10px',
                                boxShadow: '0px 8px 24px rgba(0,0,0,0.10)',
                            }}
                        />

                        <Box>
                            <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: { xs: '32px', md: '42px' }, fontWeight: 900, color: '#171717', lineHeight: 1.1 }}>
                                {recipe.title}
                            </Typography>
                            <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '15px', color: '#555555', lineHeight: 1.7, mt: '14px' }}>
                                {recipe.description}
                            </Typography>

                            <Stack direction="row" gap="10px" sx={{ flexWrap: 'wrap', mt: '22px' }}>
                                {[recipe.category || 'Sem categoria', recipe.difficulty, recipe.prepTime, recipe.portions].map((item) => (
                                    <Box
                                        key={item}
                                        sx={{
                                            px: '12px',
                                            py: '7px',
                                            borderRadius: '999px',
                                            border: '1px solid #C9C0B4',
                                            fontFamily: FONT_PRIMARY,
                                            fontSize: '12px',
                                            fontWeight: 800,
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        {item}
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    </Box>

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
                                {recipe.steps.map((step, index) => (
                                    <Box key={step.id} sx={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: '12px' }}>
                                        <Box sx={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: COLOR_ORANGE, color: '#FFFFFF', display: 'grid', placeItems: 'center', fontWeight: 800 }}>
                                            {index + 1}
                                        </Box>
                                        <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '14px', color: '#2D2D2D', lineHeight: 1.6 }}>
                                            {step.content}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>
                    </Box>
                </Box>
            )}

            <Footer />
        </Box>
    );
};

export default RecipeDetailPage;
