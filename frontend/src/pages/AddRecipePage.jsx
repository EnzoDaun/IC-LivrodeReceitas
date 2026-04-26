import React from 'react';
import { Box } from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AddRecipeForm from '@/components/AddRecipe/AddRecipeForm';
import { primaryNavigationLinks } from '@/config/navigation';

const AddRecipePage = () => (
    <Box sx={{ maxWidth: 1100, mx: 'auto', py: '28px', px: { xs: 2, md: 3 } }}>
        <Navbar links={primaryNavigationLinks} initialActiveLink="Receitas" />
        <AddRecipeForm />
        <Footer />
    </Box>
);

export default AddRecipePage;
