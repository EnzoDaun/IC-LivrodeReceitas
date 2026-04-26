import React from 'react';
import { Box } from '@mui/material';
import Navbar from '@/components/Navbar';
import Hero from '@/components/HomePage/Hero';
import FeaturedRecipes from '@/components/HomePage/FeaturedRecipes/FeaturedRecipes';
import { sampleRecipes } from '@/data/sampleRecipes';
import { primaryNavigationLinks } from '@/config/navigation';
import Journey from '@/components/HomePage/Journey/Journey';
import AboutSection from '@/components/HomePage/AboutSection';
import Footer from '@/components/Footer'

const HomePage = () => {
    const handleSearch = (query) => {

    };

    const handleCtaClick = () => {
        const recipesSection = document.getElementById('receitas');
        if (recipesSection) {
            recipesSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleViewRecipe = (recipeId) => {
        // TODO: navegar para página da receita
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
            <Journey />
            <AboutSection />
            <Footer />
        </Box>

    );
};

export default HomePage;