import React from 'react';
import {Box} from '@mui/material';
import Navbar from '../components/Navbar/Navbar';
import Login from '../components/Login/Login';
import {primaryNavigationLinks} from '../config/navigation';

const LoginPage = () => {
    const handleSearch = (query) => {
        console.log('Pesquisando por:', query);
    };

    return (
        <Box
            sx={{
                position: 'relative',
                height: '100dvh',
                overflow: 'hidden',
                backgroundImage: 'url(/assets/LoginPageImg.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <Box
                sx={{
                    maxWidth: 1100,
                    height: '100%',
                    mx: 'auto',
                    py: '28px',
                    px: {xs: 2, md: 3},
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'transparent',
                    borderRadius: '20px',
                }}
            >
                <Navbar
                    links={primaryNavigationLinks}
                    onSearch={handleSearch}
                    initialActiveLink="Login"
                />
                <Login/>
            </Box>

            <Box
                component="img"
                src="/assets/logo.png"
                alt="Livro de receitas"
                sx={{
                    position: 'absolute',
                    right: {xs: 16, md: 24},
                    bottom: {xs: 16, md: 24},
                    width: {xs: 88, sm: 104, md: 120},
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
