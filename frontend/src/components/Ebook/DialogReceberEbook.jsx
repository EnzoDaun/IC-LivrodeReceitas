import { FONT_SANS } from '@/config/constants/styles';
import React, { useState } from 'react';
import {
    Box, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, IconButton, TextField, Typography,
} from '@mui/material';
import {
    CheckCircleOutline as CheckCircleIcon,
    Close as CloseIcon,
} from '@mui/icons-material';



const DialogReceberEbook = ({ open, onClose }) => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [sent, setSent] = useState(false);

    const handleClose = () => {
        onClose();
    };

    const handleSend = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            setEmailError('Informe seu e-mail para receber o e-book.');
            return;
        }
        if (!emailRegex.test(email)) {
            setEmailError('Informe um e-mail válido.');
            return;
        }
        setEmailError('');
        setSent(true);
    };

    const handleExited = () => {
        setEmail('');
        setEmailError('');
        setSent(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            slotProps={{
                paper: { sx: { borderRadius: '20px', px: { xs: 1, sm: 2 }, py: 1 } },
                transition: { onExited: handleExited },
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pb: 1,
                fontFamily: FONT_SANS,
                fontWeight: 700,
                fontSize: '20px',
                color: 'text.primary',
            }}>
                Receber e-book
                <IconButton onClick={handleClose} size="small" sx={{ color: 'text.secondary' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: '8px !important', pb: 1 }}>
                {!sent ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography sx={{ fontFamily: FONT_SANS, fontSize: '14px', color: 'text.secondary', lineHeight: 1.6 }}>
                            Informe seu e-mail e enviaremos gratuitamente o e-book{' '}
                            <Box component="strong">Raízes e Sabores: afeto em cada parte do alimento</Box>{' '}
                            em PDF.
                        </Typography>
                        <TextField
                            autoFocus
                            fullWidth
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailError('');
                            }}
                            error={!!emailError}
                            helperText={emailError}
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                    backgroundColor: 'background.paper',
                                    '& fieldset': { borderColor: '#CEC7BA' },
                                    '&:hover fieldset': { borderColor: 'sustainable.main' },
                                    '&.Mui-focused fieldset': { borderColor: 'sustainable.main' },
                                },
                            }}
                        />
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, py: 2 }}>
                        <CheckCircleIcon sx={{ fontSize: 52, color: 'sustainable.main' }} />
                        <Typography sx={{ fontFamily: FONT_SANS, fontSize: '16px', fontWeight: 700, color: 'text.primary', textAlign: 'center' }}>
                            E-book enviado!
                        </Typography>
                        <Typography sx={{ fontFamily: FONT_SANS, fontSize: '13px', color: 'text.secondary', textAlign: 'center', lineHeight: 1.6 }}>
                            Verifique a caixa de entrada de{' '}
                            <Box component="strong">{email}</Box>.{' '}
                            Caso não encontre, confira a pasta de spam.
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            {!sent ? (
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        sx={{ borderRadius: '10px', textTransform: 'none', fontFamily: FONT_SANS, fontWeight: 500, borderColor: '#CEC7BA', color: 'text.secondary', '&:hover': { borderColor: 'text.secondary', backgroundColor: 'transparent' } }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSend}
                        variant="contained"
                        sx={{ borderRadius: '10px', textTransform: 'none', fontFamily: FONT_SANS, fontWeight: 600, backgroundColor: 'sustainable.main', boxShadow: 'none', '&:hover': { backgroundColor: 'sustainable.dark', boxShadow: 'none' } }}
                    >
                        Enviar e-book
                    </Button>
                </DialogActions>
            ) : (
                <DialogActions sx={{ px: 3, pb: 2.5, justifyContent: 'center' }}>
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        sx={{ borderRadius: '10px', textTransform: 'none', fontFamily: FONT_SANS, fontWeight: 600, backgroundColor: 'sustainable.main', boxShadow: 'none', px: 4, '&:hover': { backgroundColor: 'sustainable.dark', boxShadow: 'none' } }}
                    >
                        Fechar
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
};

export default DialogReceberEbook;