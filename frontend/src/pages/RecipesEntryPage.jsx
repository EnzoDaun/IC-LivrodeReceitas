import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import ChefDashboardPage from '@/pages/ChefDashboardPage';
import RecipesPage from '@/pages/RecipesPage';

const RecipesEntryPage = () => {
    const { isAdmin, isAuthenticated, isLoading, profile } = useAuth();

    if (isLoading || (isAuthenticated && !profile)) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
                <CircularProgress sx={{ color: '#F29F05' }} />
            </Box>
        );
    }

    return isAuthenticated && isAdmin ? <ChefDashboardPage /> : <RecipesPage />;
};

export default RecipesEntryPage;
