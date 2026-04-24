import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { primaryNavigationLinks } from '../config/navigation';

const FavoritesPage = () => {
    const navigate = useNavigate();

    const handleSearch = (query) => {
        console.log('Pesquisando por:', query);
    };

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', py: '28px', px: { xs: 2, md: 3 } }}>
            <Navbar
                links={primaryNavigationLinks}
                onSearch={handleSearch}
                initialActiveLink="Favoritas"
            />

            {/* ── CABEÇALHO DA PÁGINA ── */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '9px', mt: '40px' }}>
                <Box
                    component="img"
                    src="/assets/favorites/favoriteicon.png"
                    alt="Receitas Favoritas"
                    sx={{ width: 50, height: 50, objectFit: 'contain', flexShrink: 0 }}
                />
                <Box>
                    <Typography sx={{
                        fontFamily: "'Poppins', Inter, system-ui, sans-serif",
                        fontSize: '30px',
                        fontWeight: 800,
                        color: '#080C14',
                        lineHeight: '35px',
                        letterSpacing: '-0.4px',
                    }}>
                        Receitas Favoritas
                    </Typography>
                    <Typography sx={{
                        fontFamily: "'Poppins', Inter, system-ui, sans-serif",
                        fontSize: '16px',
                        fontWeight: 400,
                        color: '#111111',
                        lineHeight: '20px',
                    }}>
                        Suas receitas favoritas
                    </Typography>
                </Box>
            </Box>

            {/* ── ESTADO VAZIO ── */}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: '130px',
                mb: '130px',
                gap: 0,
            }}>
                <Box
                    component="img"
                    src="/assets/noData.png"
                    alt="Nenhuma receita favoritada"
                    sx={{ width: 86, height: 86, objectFit: 'contain', mb: '15px' }}
                />

                <Typography sx={{
                    fontFamily: "'Poppins', Inter, system-ui, sans-serif",
                    fontSize: '25px',
                    fontWeight: 800,
                    color: '#202020',
                    lineHeight: '30px',
                    letterSpacing: '-0.2px',
                    textAlign: 'center',
                }}>
                    Você ainda não favoritou receitas
                </Typography>

                <Typography sx={{
                    fontFamily: "'Poppins', Inter, system-ui, sans-serif",
                    fontSize: '16px',
                    fontWeight: 400,
                    color: '#3E3E3E',
                    lineHeight: '20px',
                    textAlign: 'center',
                    mt: '2px',
                }}>
                    Favorite receitas clicando no icone de coração
                </Typography>

                <Button
                    onClick={() => navigate('/')}
                    disableElevation
                    disableRipple
                    sx={{
                        mt: '38px',
                        width: '150px',
                        height: '44px',
                        backgroundColor: '#F29F05',
                        borderRadius: '6px',
                        border: 'none',
                        color: '#FFFFFF',
                        fontFamily: "'Poppins', Inter, system-ui, sans-serif",
                        fontSize: '13px',
                        fontWeight: 500,
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': {
                            backgroundColor: '#F29F05',
                            boxShadow: 'none',
                        },
                    }}
                >
                    Explorar Receitas
                </Button>
            </Box>

            <Footer />
        </Box>
    );
};

export default FavoritesPage;
