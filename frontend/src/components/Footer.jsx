import { FONT_SANS } from '@/config/constants/styles';
import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
    Instagram as InstagramIcon,
    YouTube as YouTubeIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { socialLinks } from '@/config/socialLinks';

const socialIconByName = {
    instagram: InstagramIcon,
    youtube: YouTubeIcon,
};

const footerLinks = [
    { label: 'RECEITAS', to: '/receitas' },
    { label: 'MAIS VISTAS', scrollTo: 'mais-vistas' },
    { label: 'FAVORITAS', to: '/favoritas' },
    { label: 'SOBRE NÓS', to: '/sobre' },
    { label: 'LOGIN', to: '/login' },
];

const linkSx = {
    fontFamily: FONT_SANS,
    color: 'background.default',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: 1,
    letterSpacing: 0,
    textDecoration: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    p: 0,
    '&:hover': { color: 'primary.contrastText' },
};

const Footer = () => {
    const navigate = useNavigate();
    const { isAuthenticated, signOut } = useAuth();
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const confirmLogout = async () => {
        setLogoutDialogOpen(false);
        try {
            await signOut();
            navigate('/login', { replace: true });
        } catch (error) {
            window.alert(error.message || 'Não foi possível sair da conta.');
        }
    };

    const handleLinkClick = (link, event) => {
        if (link.scrollTo) {
            event.preventDefault();
            if (window.location.pathname === '/') {
                document.getElementById(link.scrollTo)?.scrollIntoView({ behavior: 'smooth' });
            } else {
                navigate('/', { state: { scrollTo: link.scrollTo } });
            }
        }
    };

    return (
        <>
            <Box
                component="footer"
                sx={{
                    mt: 4,
                    mb: 4,
                    py: { xs: 3, md: 3.5 },
                    px: { xs: 2.5, md: 4 },
                    backgroundColor: 'text.primary',
                    borderRadius: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: .5,
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 3,
                        flexDirection: { xs: 'column', md: 'row' },
                    }}
                >
                    {/* ── LOGO → home ── */}
                    <Box
                        component={RouterLink}
                        to="/"
                        sx={{
                            display: 'flex', alignItems: 'center', gap: 1.5,
                            minWidth: { md: 190 }, textDecoration: 'none',
                        }}
                    >
                        <Box
                            component="img"
                            src="/assets/icons/logo.png"
                            alt="Receitas Fantásticas"
                            sx={{ width: 40, height: 40, objectFit: 'contain', flexShrink: 0 }}
                        />
                        <Typography
                            variant="body2"
                            sx={{ fontFamily: FONT_SANS, width: 110, color: 'primary.contrastText', fontWeight: 600, fontSize: '13px', lineHeight: 1.2 }}
                        >
                            Receitas Fantásticas
                        </Typography>
                    </Box>

                    {/* ── LINKS ── */}
                    <Box
                        component="nav"
                        aria-label="Links do rodapé"
                        sx={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexWrap: 'wrap', gap: { xs: 1.2, md: 1.6 },
                        }}
                    >
                        {footerLinks.map((link, index) => {
                            const isLoginLink = link.label === 'LOGIN';
                            const showAsSair = isLoginLink && isAuthenticated;
                            const displayLabel = showAsSair ? 'SAIR' : link.label;

                            return (
                                <React.Fragment key={link.label}>
                                    {index > 0 && (
                                        <Box
                                            aria-hidden="true"
                                            sx={{
                                                width: '1px', height: 14,
                                                backgroundColor: (theme) => alpha(theme.palette.background.default, 0.08),
                                            }}
                                        />
                                    )}
                                    {showAsSair ? (
                                        <Typography
                                            component="button"
                                            onClick={() => setLogoutDialogOpen(true)}
                                            sx={linkSx}
                                        >
                                            {displayLabel}
                                        </Typography>
                                    ) : (
                                        <Typography
                                            component={link.to ? RouterLink : 'button'}
                                            to={link.to}
                                            onClick={link.scrollTo ? (e) => handleLinkClick(link, e) : undefined}
                                            sx={linkSx}
                                        >
                                            {displayLabel}
                                        </Typography>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </Box>

                    {/* ── REDES SOCIAIS ── */}
                    <Box
                        sx={{
                            display: 'flex', alignItems: 'center',
                            justifyContent: { xs: 'center', md: 'flex-end' },
                            gap: 1, minWidth: { md: 190 },
                        }}
                    >
                        {socialLinks.map(({ label, href, icon }) => {
                            const SocialIcon = socialIconByName[icon];
                            return (
                                <IconButton
                                    key={label}
                                    component="a"
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={label}
                                    sx={{
                                        width: 28, height: 28, color: 'background.default', p: 0,
                                        '&:hover': { color: 'primary.contrastText', backgroundColor: 'transparent' },
                                    }}
                                >
                                    <SocialIcon sx={{ fontSize: 19 }} />
                                </IconButton>
                            );
                        })}
                    </Box>
                </Box>

                <Box
                    aria-hidden="true"
                    sx={{
                        width: '100%', height: '1px',
                        backgroundColor: (theme) => alpha(theme.palette.background.default, 0.08),
                        marginTop: 1,
                    }}
                />
            </Box>

            {/* ── DIALOG CONFIRMAR LOGOUT ── */}
            <Dialog
                open={logoutDialogOpen}
                onClose={() => setLogoutDialogOpen(false)}
                maxWidth="xs"
                fullWidth
                slotProps={{ paper: { sx: { borderRadius: '16px', px: 1 } } }}
            >
                <DialogTitle sx={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: '18px', pb: 1 }}>
                    Sair da conta
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#667085' }}>
                        Deseja mesmo sair?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button
                        onClick={() => setLogoutDialogOpen(false)}
                        variant="outlined"
                        sx={{ borderRadius: '8px', textTransform: 'none', fontFamily: FONT_SANS, fontWeight: 500, borderColor: '#CEC7BA', color: '#667085', '&:hover': { borderColor: '#667085', backgroundColor: 'transparent' } }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={confirmLogout}
                        variant="contained"
                        sx={{ borderRadius: '8px', textTransform: 'none', fontFamily: FONT_SANS, fontWeight: 600, backgroundColor: '#F06A57', boxShadow: 'none', '&:hover': { backgroundColor: '#d9533e', boxShadow: 'none' } }}
                    >
                        Sair
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Footer;
