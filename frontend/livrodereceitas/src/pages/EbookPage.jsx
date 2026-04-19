import React from 'react';
import {Box, Button, Typography} from '@mui/material';
import {alpha} from '@mui/material/styles';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Chapter from '../components/Chapter/Chapter';
import {primaryNavigationLinks} from '../config/navigation';

const sansSerifFont = 'Montserrat, Poppins, sans-serif';

const ebookSections = Array.from({length: 7}, (_, index) => ({
    id: `ebook-section-${index + 1}`,
    label: `Bloco ${index + 1}`,
    backgroundKey: index % 2 === 0 ? 'default' : 'paper',
}));

const EbookPage = () => {
    const handleSearch = (query) => {
        console.log('Pesquisando por:', query);
    };

    return (
        <Box>
            <Box
                component="section"
                sx={{
                    backgroundImage: 'url(/assets/ebookImages/EbookBackgroundImage.png)',
                    backgroundSize: '60% auto',
                    backgroundPosition: 'bottom center',
                    backgroundRepeat: 'repeat',
                }}
            >
                <Box
                    sx={{
                        maxWidth: 1100,
                        mx: 'auto',
                        px: {xs: 2, md: 3},
                        pt: '28px',
                    }}
                >
                    <Navbar
                        links={primaryNavigationLinks}
                        onSearch={handleSearch}
                        initialActiveLink="E-book"
                    />
                </Box>

                <Box
                    sx={{
                        minHeight: {xs: 360, md: 480},
                        px: {xs: 2.5, md: 4},
                        py: {xs: 3, md: 4},
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        sx={{
                            maxWidth: 840,
                            mx: 'auto',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <Typography
                            variant="body1"
                            sx={{
                                fontFamily: sansSerifFont,
                                px: {xs: 3, md: 5},
                                py: 1.5,
                                backgroundColor: (theme) => alpha(theme.palette.sustainable.main, 0.74),
                                borderRadius: '90px',
                                color: 'sustainable.contrastText',
                                fontWeight: 600,
                                fontSize: {xs: '16px', md: '18px'},
                            }}
                        >
                            Nossa Jornada Sustentavel
                        </Typography>
                        <Typography
                            variant="h1"
                            sx={{
                                fontFamily: 'Georgia, "Times New Roman", serif',
                                color: 'text.primary',
                                fontWeight: 700,
                                fontSize: {xs: '34px', md: '54px'},
                                lineHeight: 1,
                            }}
                        >
                            A Historia de Uma Cozinha Consciente
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                fontFamily: sansSerifFont,
                                color: 'text.primary',
                                fontSize: {xs: '16px', md: '20px'},
                                lineHeight: 1.5,
                                maxWidth: 680,
                            }}
                        >
                            Uma jornada de descoberta, amor pela natureza e compromisso com o planeta
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box
                component="main"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                }}
            >
                {ebookSections.slice(1).map((section, index) => {
                    const sectionIndex = index + 1;

                    return (
                        <Box
                            key={section.id}
                            component="section"
                            sx={{
                                minHeight: {xs: 360, md: 480},
                                px: {xs: 2.5, md: 4},
                                py: {xs: 3, md: 4},
                                backgroundColor: (theme) => alpha(theme.palette.background[section.backgroundKey], 0.75),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {sectionIndex === 1 ? (
                                <Box
                                    sx={{
                                        width: '100%',
                                        maxWidth: 1100,
                                        mx: 'auto',
                                    }}
                                >
                                    <Chapter
                                        chapterNumber="1"
                                        title="Titulo do capitulo"
                                        text="Texto do capitulo."
                                    />
                                </Box>
                            ) : sectionIndex === 4 ? (
                                <Box
                                    sx={{
                                        width: '100%',
                                        maxWidth: 1100,
                                        mx: 'auto',
                                    }}
                                >
                                    <Chapter
                                        chapterNumber="2"
                                        title="Titulo do capitulo"
                                        text="Texto do capitulo."
                                    />
                                </Box>
                            ) : sectionIndex === 6 ? (
                                <Box
                                    sx={{
                                        width: '100%',
                                        maxWidth: 780,
                                        mx: 'auto',
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 2.5,
                                    }}
                                >
                                    <Typography
                                        variant="h2"
                                        sx={{
                                            fontFamily: 'Georgia, "Times New Roman", serif',
                                            color: 'text.primary',
                                            fontWeight: 700,
                                            fontSize: {xs: '32px', md: '48px'},
                                            lineHeight: 1.1,
                                            letterSpacing: 0,
                                        }}
                                    >
                                        Faca Parte Desta Jornada
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontFamily: sansSerifFont,
                                            color: 'text.primary',
                                            fontSize: {xs: '16px', md: '20px'},
                                            lineHeight: 1.6,
                                            letterSpacing: 0,
                                        }}
                                    >
                                        Cada pessoa que adota a cozinha sustentavel contribui para um futuro melhor. Comece hoje mesmo explorando nossas receitas e descobrindo o potencial completo dos alimentos.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            mt: 1,
                                            px: 4,
                                            py: 1.4,
                                            backgroundColor: 'sustainable.main',
                                            color: 'sustainable.contrastText',
                                            borderRadius: '8px',
                                            fontFamily: sansSerifFont,
                                            fontWeight: 700,
                                            fontSize: '14px',
                                            textTransform: 'none',
                                            boxShadow: 'none',
                                            '&:hover': {
                                                backgroundColor: 'sustainable.dark',
                                                boxShadow: 'none',
                                            },
                                        }}
                                    >
                                        Explorar Receitas
                                    </Button>
                                </Box>
                            ) : (
                                <Typography
                                    variant="h6"
                                    component="h2"
                                    sx={{
                                        fontFamily: sansSerifFont,
                                        color: 'text.primary',
                                        fontWeight: 600,
                                        fontSize: {xs: '18px', md: '20px'},
                                    }}
                                >
                                    {section.label}
                                </Typography>
                            )}
                        </Box>
                    );
                })}
            </Box>

            <Box
                sx={{
                    maxWidth: 1100,
                    mx: 'auto',
                    px: {xs: 2, md: 3},
                }}
            >
                <Footer/>
            </Box>
        </Box>
    );
};

export default EbookPage;
