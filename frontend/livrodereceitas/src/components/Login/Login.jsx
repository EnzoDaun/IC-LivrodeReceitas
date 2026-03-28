import React from 'react';
import {
    Box,
    Button,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {
   MailSharp, PersonSharp,
} from '@mui/icons-material';

const inputStyles = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '10px',
        backgroundColor: '#FAF7F3',
        maxWidth: 466,
        maxHeight: 64,
        '& fieldset': {
            borderColor: '#98A2B3',
            borderWidth: 2,
        },
        '&:hover fieldset': {
            borderColor: '#F05E46',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#F05E46',
            borderWidth: 1.5,
        },
    },
    '& .MuiInputBase-input': {
        py: 1.8,
        px: 0.4,
        fontSize: '14px',
        color: '#98A2B3',
    },
};

const Login = () => {
    return (
        <Box
            id="login"
            sx={{
                flex: 1,
                minHeight: 0,
                mt: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: '601px',
                    maxHeight: '541px',
                    p: {xs: 3, sm: 4.5, md: 5},
                    borderRadius: '16px',
                    backgroundColor: 'rgba(250, 250, 250, 0.76)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                }}
            >
                <Box sx={{width: '100%', maxWidth: 458, mx: 'auto'}}>
                    <Typography
                        component="h1"
                        sx={{
                            fontWeight: 'bold',
                            color: '#101828',
                            fontSize: {xs: '32px', md: '32px'},
                            letterSpacing: '-1px',
                        }}
                    >
                        Login
                    </Typography>

                    <Typography
                        sx={{
                            fontWeight: 'medium',
                            mt: 1.2,
                            color: '#667085',
                            maxWidth: 320,
                        }}
                    >
                        Insira suas informações de login
                    </Typography>

                    <Stack spacing={4} sx={{mt: 4}}>
                        <TextField
                            fullWidth
                            type="email"
                            variant="outlined"
                            placeholder="E-mail"
                            sx={inputStyles}
                            slotProps={{
                                input: {
                                    placeholder: 'E-mail',
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MailSharp sx={{fontSize: 20, color: '#98A2B3'}}/>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            type="password"
                            variant="outlined"
                            placeholder="Senha"
                            sx={inputStyles}
                            slotProps={{
                                input: {
                                    placeholder: 'Senha',
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonSharp sx={{fontSize: 20, color: '#98A2B3'}}/>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </Stack>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: {xs: 'center', sm: 'flex-end'},
                            mt: 1,
                        }}
                    >
                        <Button
                            variant="contained"
                            sx={{
                                width: {xs: '100%', sm: 'auto'},
                                maxWidth: {xs: '100%', sm: 140},
                                maxHeight: 60,
                                py: 1.7,
                                px: 2.6,
                                borderRadius: '8px',
                                backgroundColor: '#F29F05',
                                color: '#FFFFF',
                                boxShadow: '0 10px 18px rgba(255, 208, 86, 0.28)',
                                fontSize: '13px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                '&:hover': {
                                    backgroundColor: '#F2C442',
                                    boxShadow: '0 12px 22px rgba(255, 208, 86, 0.34)',
                                },
                            }}
                        >
                            <Box component="span"/>
                            <Box component="span">Entrar</Box>
                            <Typography component="span" sx={{fontSize: '20px', lineHeight: 1}}>
                                {'>'}
                            </Typography>
                        </Button>
                    </Box>

                    <Box
                        sx={{
                            width: '100%',
                            height: '1px',
                            backgroundColor: '#475467',
                            opacity: 0.1,
                            mx: 'auto',
                            mt: 3,
                        }}
                    />

                    <Stack
                        direction={{xs: 'column', sm: 'row'}}
                        spacing={1}
                        justifyContent="space-between"
                        alignItems={{xs: 'center', sm: 'stretch'}}
                        sx={{mt: 2.5}}
                    >
                        <Typography
                            component="a"
                            href="#"
                            sx={{
                                fontSize: '13px',
                                color: '#6B6B6B',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                '&:hover': {
                                    color: '#2D2D2D',
                                },
                            }}
                        >
                            Esqueci minha senha
                        </Typography>
                        <Typography
                            component="a"
                            href="#"
                            sx={{
                                fontSize: '13px',
                                color: '#F29F05',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                '&:hover': {
                                    color: '#F2C442',
                                },
                            }}
                        >
                            Registrar nova conta
                        </Typography>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;
