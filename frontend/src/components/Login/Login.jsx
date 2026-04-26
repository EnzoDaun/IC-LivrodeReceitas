import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {
    MailSharp, PersonSharp,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

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
    const navigate = useNavigate();
    const location = useLocation();
    const {
        authError,
        clearAuthError,
        configError,
        isAuthenticated,
        signIn,
        signUp,
        resetPassword,
    } = useAuth();
    const [mode, setMode] = useState('login');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            const redirectTo = location.state?.from?.pathname || '/receitas';
            navigate(redirectTo, { replace: true });
        }
    }, [isAuthenticated, location.state, navigate]);

    const resetMessages = () => {
        clearAuthError();
        setLocalError('');
        setFeedbackMessage('');
    };

    const handleModeChange = (nextMode) => {
        setMode(nextMode);
        resetMessages();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        resetMessages();

        try {
            setIsSubmitting(true);

            if (mode === 'login') {
                await signIn({ email, password });
                navigate('/receitas', { replace: true });
                return;
            }

            if (mode === 'register') {
                await signUp({
                    email,
                    password,
                    fullName,
                });
                setFeedbackMessage('Conta criada. Verifique seu email para confirmar o cadastro, se a confirmacao estiver ativa.');
                return;
            }

            await resetPassword(email);
            setFeedbackMessage('Email de recuperacao enviado.');
        } catch (error) {
            setLocalError(error.message || 'Nao foi possivel concluir a autenticacao.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    p: { xs: 3, sm: 4.5, md: 5 },
                    borderRadius: '16px',
                    backgroundColor: 'rgba(240, 235, 235, 0.8)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                }}
            >
                <Box sx={{ width: '100%', maxWidth: 458, mx: 'auto' }}>
                    <Typography
                        component="h1"
                        sx={{
                            fontWeight: 'bold',
                            color: '#101828',
                            fontSize: { xs: '32px', md: '32px' },
                            letterSpacing: '-1px',
                        }}
                    >
                        {mode === 'register' ? 'Criar conta' : 'Login'}
                    </Typography>

                    <Typography
                        sx={{
                            fontWeight: 'medium',
                            mt: 1.2,
                            color: '#667085',
                            maxWidth: 360,
                        }}
                    >
                        {mode === 'reset'
                            ? 'Informe seu email para recuperar a senha'
                            : 'Insira suas informacoes de login'}
                    </Typography>

                    <Stack component="form" spacing={4} sx={{ mt: 4 }} onSubmit={handleSubmit}>
                        {mode === 'register' && (
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Nome completo"
                                value={fullName}
                                onChange={(event) => setFullName(event.target.value)}
                                sx={inputStyles}
                                slotProps={{
                                    input: {
                                        placeholder: 'Nome completo',
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonSharp sx={{ fontSize: 20, color: '#98A2B3' }} />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        )}
                        <TextField
                            fullWidth
                            type="email"
                            variant="outlined"
                            placeholder="E-mail"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            sx={inputStyles}
                            slotProps={{
                                input: {
                                    placeholder: 'E-mail',
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MailSharp sx={{ fontSize: 20, color: '#98A2B3' }} />
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
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            disabled={mode === 'reset'}
                            sx={inputStyles}
                            slotProps={{
                                input: {
                                    placeholder: mode === 'reset' ? 'Nao necessario para recuperacao' : 'Senha',
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonSharp sx={{ fontSize: 20, color: '#98A2B3' }} />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        {(configError || localError || authError || feedbackMessage) && (
                            <Typography sx={{ fontSize: '13px', color: feedbackMessage ? '#067647' : '#B42318' }}>
                                {configError || localError || authError || feedbackMessage}
                            </Typography>
                        )}

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: { xs: 'center', sm: 'flex-end' },
                                mt: 1,
                            }}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isSubmitting || Boolean(configError)}
                                sx={{
                                    width: { xs: '100%', sm: 'auto' },
                                    maxWidth: { xs: '100%', sm: 240 },
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
                                    gap: 1,
                                    '&:hover': {
                                        backgroundColor: '#F2C442',
                                        boxShadow: '0 12px 22px rgba(255, 208, 86, 0.34)',
                                    },
                                }}
                            >
                                {isSubmitting && <CircularProgress size={16} sx={{ color: '#FFFFFF' }} />}
                                <Box component="span">
                                    {mode === 'login' && 'Entrar'}
                                    {mode === 'register' && 'Criar conta'}
                                    {mode === 'reset' && 'Enviar recuperacao'}
                                </Box>
                                <Typography component="span" sx={{ fontSize: '20px', lineHeight: 1 }}>
                                    {'>'}
                                </Typography>
                            </Button>
                        </Box>
                    </Stack>

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
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1}
                        justifyContent="space-between"
                        alignItems={{ xs: 'center', sm: 'stretch' }}
                        sx={{ mt: 2.5 }}
                    >
                        <Typography
                            component="button"
                            type="button"
                            onClick={() => handleModeChange(mode === 'reset' ? 'login' : 'reset')}
                            sx={{
                                border: 'none',
                                background: 'transparent',
                                fontSize: '13px',
                                color: '#6B6B6B',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                cursor: 'pointer',
                                '&:hover': {
                                    color: '#2D2D2D',
                                },
                            }}
                        >
                            {mode === 'reset' ? 'Voltar ao login' : 'Esqueci minha senha'}
                        </Typography>
                        <Typography
                            component="button"
                            type="button"
                            onClick={() => handleModeChange(mode === 'register' ? 'login' : 'register')}
                            sx={{
                                border: 'none',
                                background: 'transparent',
                                fontSize: '13px',
                                color: '#F29F05',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                cursor: 'pointer',
                                '&:hover': {
                                    color: '#F2C442',
                                },
                            }}
                        >
                            {mode === 'register' ? 'Ja tenho conta' : 'Registrar nova conta'}
                        </Typography>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;
