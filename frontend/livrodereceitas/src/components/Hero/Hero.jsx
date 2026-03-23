import React from 'react';
import {Box, Typography, Button} from '@mui/material';

const Hero = ({
                  title = 'Livro de receitas',
                  subtitle = 'Embarque num mundo de sabores e alegrias com receitas fantásticas usando do aproveitamento integral dos alimentos',
                  ctaText = 'Explorar Receitas',
                  backgroundImage = '/assets/backgroundHero.jpg',
                  onCtaClick,
              }) => {
    return (
        <Box
            sx={{
                mt: 3,
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: {xs: 340, md: 460},
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: {xs: 3, md: 6},
                }}
            >
                {/* Conteúdo centralizado */}
                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 2,
                        textAlign: 'center',
                        maxWidth: 640,
                    }}
                >
                    <Typography
                        variant="h1"
                        component="h1"
                        sx={{
                            color: '#F05E46',
                            fontWeight: 800,
                            lineHeight: 1.05,
                            fontSize: {xs: 44, sm: 58, md: 70},
                            letterSpacing: '-1.5px',
                            textShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
                            mb: 2.5,
                        }}
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            mt: 2.5,
                            color: '#2D2D2D',
                            maxWidth: 540,
                            mx: 'auto',
                            fontSize: {xs: '14px', md: '15px'},
                            lineHeight: 1.65,
                            fontWeight: 400,
                            textShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
                        }}
                    >
                        {subtitle}
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={onCtaClick}
                        sx={{
                            mt: 4,
                            px: 3.5,
                            py: 1.4,
                            borderRadius: '22px',
                            backgroundColor: '#FF8C42',
                            boxShadow: '0 3px 10px rgba(255,140,66,0.25)',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.6px',
                            '&:hover': {
                                backgroundColor: '#FF7D2E',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 5px 14px rgba(255,140,66,0.35)',
                            },
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {ctaText}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Hero;
