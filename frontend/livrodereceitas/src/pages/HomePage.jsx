import React from 'react';
import {Box} from '@mui/material';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import FeaturedRecipes from '../components/FeaturedRecipes/FeaturedRecipes';
import {sampleRecipes} from '../data/sampleRecipes';
import {primaryNavigationLinks} from '../config/navigation';

const HomePage = () => {
    const handleSearch = (query) => {
        console.log('Pesquisando por:', query);
    };

    const handleCtaClick = () => {
        const recipesSection = document.getElementById('receitas');
        if (recipesSection) {
            recipesSection.scrollIntoView({behavior: 'smooth'});
        }
    };

    const handleViewRecipe = (recipeId) => {
        console.log('Visualizar receita:', recipeId);
    };

    return (
        <Box
            sx={{
                maxWidth: 1100,
                mx: 'auto',
                py: '28px',
                px: {xs: 2, md: 3},
            }}
        >
            <Navbar
                links={primaryNavigationLinks}
                onSearch={handleSearch}
                initialActiveLink="Receitas"
            />
            <Hero
                title="Livro de receitas"
                subtitle="Embarque num mundo de sabores e alegrias com receitas fantásticas usando do aproveitamento integral dos alimentos"
                ctaText="Explorar Receitas"
                onCtaClick={handleCtaClick}
            />
            <Box id="receitas">
                <FeaturedRecipes
                    recipes={sampleRecipes}
                    onViewRecipe={handleViewRecipe}
                />
            </Box>
        </Box>
    );
};

export default HomePage;
