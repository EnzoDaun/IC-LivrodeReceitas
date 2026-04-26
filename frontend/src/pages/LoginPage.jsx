import React from 'react';
import { Box } from '@mui/material';
import Navbar from '@/components/Navbar';
import Login from '@/components/Login/Login';
import { primaryNavigationLinks } from '@/config/navigation';

const LoginPage = () => {
    return (
        <Box
            sx={{
                position: 'relative',
                minHeight: '100dvh',
                overflow: 'hidden',
            }}
        >
            <Box
                aria-hidden="true"
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'url(/assets/backgrounds/LoginPageImg.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: { xs: '72% center', md: 'center top' },
                    backgroundRepeat: 'no-repeat',
                }}
            />

            <Box
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    maxWidth: 1100,
                    minHeight: '100dvh',
                    mx: 'auto',
                    py: '28px',
                    px: { xs: 2, md: 3 },
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'transparent',
                    borderRadius: '20px',
                }}
            >
                <Navbar
                    links={primaryNavigationLinks}

                    initialActiveLink="Login"
                />
                <Login />
            </Box>

            <Box
                component="img"
                src="/assets/icons/logo.png"
                alt="Livro de receitas"
                sx={{
                    position: 'absolute',
                    right: { xs: 16, md: 24 },
                    bottom: { xs: 16, md: 24 },
                    zIndex: 1,
                    width: { xs: 88, sm: 104, md: 120 },
                    height: 'auto',
                    filter: 'brightness(0) invert(1)',
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}
            />
        </Box>
    );
};

export default LoginPage;