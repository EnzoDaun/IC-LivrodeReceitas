import React from 'react';
import {Box, IconButton, SvgIcon, Typography} from '@mui/material';
import {
    Facebook as FacebookIcon,
    Instagram as InstagramIcon,
    YouTube as YouTubeIcon,
} from '@mui/icons-material';
import {Link as RouterLink} from 'react-router-dom';

const separatorColor = 'rgba(240, 235, 225, 0.08)';
const sansSerifFont = 'Montserrat, Poppins, sans-serif';

const footerLinks = [
    {label: 'RECEITAS', to: "/"},
    {label: 'MAIS VISTAS', to: "/"},
    {label: 'FAVORITAS', to: "/"},
    {label: 'SOBRE NOS', to: "/"},
    {label: 'LOGIN', to: '/login'},
];

const socialLinks = [
    {label: 'TikTok', href: '#', icon: 'tiktok'},
    {label: 'Facebook', href: '#', icon: FacebookIcon},
    {label: 'Instagram', href: '#', icon: InstagramIcon},
    {label: 'YouTube', href: '#', icon: YouTubeIcon},
];

const TikTokIcon = (props) => (
    // ainda n tem o icon do tiktok no mui
    <SvgIcon viewBox="0 0 24 24" {...props}>
        <path d="M16.6 5.82c1.18 1.3 2.66 2.04 4.4 2.18v3.47c-1.62-.04-3.1-.43-4.4-1.18v5.36c0 3.44-2.26 5.85-5.57 5.85-3.01 0-5.03-1.86-5.03-4.64 0-2.93 2.19-5.01 5.28-5.01.32 0 .62.03.91.09v3.61a2.8 2.8 0 0 0-1.08-.21c-1.02 0-1.71.61-1.71 1.51 0 .82.61 1.38 1.51 1.38 1.07 0 1.72-.72 1.72-1.9V2.5h3.97v3.32Z"/>
    </SvgIcon>
);

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                mt: 4,
                mb: 4,
                py: {xs: 3, md: 3.5},
                px: {xs: 2.5, md: 4},
                backgroundColor: '#262522',
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
                    flexDirection: {xs: 'column', md: 'row'},
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        minWidth: {md: 190},
                    }}
                >
                    <Box
                        component="img"
                        src="/assets/logo.png"
                        alt="Livro de receitas"
                        sx={{
                            width: 40,
                            height: 40,
                            objectFit: 'contain',
                            flexShrink: 0,
                        }}
                    />
                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: sansSerifFont,
                            width: 77,
                            color: '#FFFFFF',
                            fontWeight: 600,
                            fontSize: '13px',
                            lineHeight: 1.2,
                        }}
                    >
                        Livro de receitas
                    </Typography>
                </Box>

                <Box
                    component="nav"
                    aria-label="Links do rodape"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        gap: {xs: 1.2, md: 1.6},
                    }}
                >
                    {footerLinks.map((link, index) => (
                        <React.Fragment key={link.label}>
                            {index > 0 && (
                                <Box
                                    aria-hidden="true"
                                    sx={{
                                        width: '1px',
                                        height: 14,
                                        backgroundColor: separatorColor,
                                    }}
                                />
                            )}
                            <Typography
                                component={link.to ? RouterLink : 'a'}
                                to={link.to}
                                href={link.href}
                                sx={{
                                    fontFamily: sansSerifFont,
                                    color: '#F0EBE1',
                                    fontWeight: 600,
                                    fontSize: '12px',
                                    lineHeight: 1,
                                    letterSpacing: 0,
                                    textDecoration: 'none',
                                    '&:hover': {
                                        color: '#FFFFFF',
                                    },
                                }}
                            >
                                {link.label}
                            </Typography>
                        </React.Fragment>
                    ))}
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: {xs: 'center', md: 'flex-end'},
                        gap: 1,
                        minWidth: {md: 190},
                    }}
                >
                    {socialLinks.map(({label, href, icon}) => {
                        const SocialIcon = icon === 'tiktok' ? TikTokIcon : icon;

                        return (
                            <IconButton
                                key={label}
                                component="a"
                                href={href}
                                aria-label={label}
                                sx={{
                                    width: 28,
                                    height: 28,
                                    color: '#F0EBE1',
                                    p: 0,
                                    '&:hover': {
                                        color: '#FFFFFF',
                                        backgroundColor: 'transparent',
                                    },
                                }}
                            >
                                <SocialIcon sx={{fontSize: 19}}/>
                            </IconButton>
                        );
                    })}
                </Box>
            </Box>

            <Box
                aria-hidden="true"
                sx={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: separatorColor,
                    marginTop: 1,
                }}
            />
        </Box>
    );
};

export default Footer;
