import React, { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    CircularProgress,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AddRecipeForm from '@/components/AddRecipe/AddRecipeForm';
import { primaryNavigationLinks } from '@/config/navigation';
import { COLOR_ORANGE } from '@/config/constants/styles';
import { getRecipeById } from '@/services/supabase/recipeService';

const EditRecipePage = () => {
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
                const nextRecipe = await getRecipeById(recipeId);

                if (isMounted) {
                    setRecipe(nextRecipe);
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
                <AddRecipeForm mode="edit" initialRecipe={recipe} />
            )}

            <Footer />
        </Box>
    );
};

export default EditRecipePage;
