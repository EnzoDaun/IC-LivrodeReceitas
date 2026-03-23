import React from 'react';
import {ThemeProvider, CssBaseline, Box} from '@mui/material';
import theme from './theme/theme';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import FeaturedRecipes from './components/FeaturedRecipes/FeaturedRecipes';
import {sampleRecipes} from './data/sampleRecipes';

function App() {
    const handleSearch = (query) => {
        console.log('Pesquisando por:', query);
    };

    const handleCtaClick = () => {
        console.log('CTA clicado - Explorar Receitas');
        const recipesSection = document.getElementById('receitas');
        if (recipesSection) {
            recipesSection.scrollIntoView({behavior: 'smooth'});
        }
    };

    const handleViewRecipe = (recipeId) => {
        console.log('Visualizar receita:', recipeId);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundColor: 'background.default',
                }}
            >
                <Box
                    sx={{
                        maxWidth: 1100,
                        mx: 'auto',
                        my: '28px',
                        px: {xs: 2, md: 3},
                        background: 'transparent',
                        borderRadius: '20px',
                    }}
                >
                    <Navbar onSearch={handleSearch}/>
                    <Hero
                        title="Livro de receitas"
                        subtitle="Embarque num mundo de sabores e alegrias com receitas fantásticas usando do aproveitamento integral dos alimentos"
                        ctaText="Explorar Receitas"
                        onCtaClick={handleCtaClick}
                    />
                    <div id="receitas">
                        <FeaturedRecipes
                            recipes={sampleRecipes}
                            onViewRecipe={handleViewRecipe}
                        />
                    </div>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default App;
