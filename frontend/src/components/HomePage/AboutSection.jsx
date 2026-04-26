import { FONT_PRIMARY } from '@/config/constants/styles';
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function AboutSection() {
    return (
        <Box sx={{
            width: '100%',
            backgroundColor: 'transparent',
            boxSizing: 'border-box',
            mt: '28px',
        }}>
            {/* Container principal */}
            <Box sx={{
                width: '100%',
                height: { xs: 'auto', md: '523px' },
                border: '1px solid #CEC7BA',
                borderRadius: { xs: '18px', md: '28px' },
                position: { xs: 'static', md: 'relative' },
                overflow: 'hidden',
                boxSizing: 'border-box',
                display: { xs: 'flex', md: 'block' },
                flexDirection: { xs: 'column', md: 'initial' },
                gap: { xs: '12px', md: 0 },
                p: { xs: '12px', md: 0 },
            }}>

                {/* ── BLOCO DE TEXTO ── */}
                <Box sx={{
                    position: { xs: 'static', md: 'absolute' },
                    left: { md: '30px' },
                    top: { md: '49px' },
                    width: { xs: '100%', md: '340px' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '8px',
                    p: { xs: '8px 4px 2px', md: 0 },
                    boxSizing: 'border-box',
                }}>
                    {/* Badge */}
                    <Box sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#F05E46',
                        borderRadius: '999px',
                        px: '11px',
                        height: '19px',
                    }}>
                        <Typography sx={{
                            fontFamily: FONT_PRIMARY,
                            fontSize: '10px',
                            fontWeight: 700,
                            color: '#FFFFFF',
                            textTransform: 'uppercase',
                            lineHeight: 1,
                            letterSpacing: '0.3px',
                        }}>
                            SOBRE NÓS
                        </Typography>
                    </Box>

                    {/* Título */}
                    <Typography sx={{
                        fontFamily: FONT_PRIMARY,
                        fontSize: { xs: '24px', sm: '26px', md: '29px' },
                        fontWeight: 900,
                        color: '#2D2D2D',
                        lineHeight: { xs: '26px', sm: '28px', md: '30px' },
                        textTransform: 'uppercase',
                    }}>
                        NOSSA HISTÓRIA<br />E PROPÓSITO
                    </Typography>

                    {/* Parágrafo */}
                    <Typography sx={{
                        fontFamily: FONT_PRIMARY,
                        fontSize: '12px',
                        fontWeight: 400,
                        color: '#4F4F4F',
                        lineHeight: '17px',
                        maxWidth: { xs: '100%', sm: '420px', md: '260px' },
                    }}>
                        Da cozinha afetiva ao cuidado com o alimento por inteiro. Aqui, cascas, talos, sementes e sobras viram preparo, memória e escolhas mais sustentáveis.
                    </Typography>

                    {/* Botão */}
                    <Button
                        component={RouterLink}
                        to="/sobre"
                        disableElevation
                        disableRipple
                        sx={{
                            mt: '4px',
                            width: { xs: '96px', md: '82px' },
                            height: '28px',
                            border: '1px solid #2D2D2D',
                            borderRadius: '999px',
                            backgroundColor: 'transparent',
                            color: '#2D2D2D',
                            fontFamily: FONT_PRIMARY,
                            fontSize: '10px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.2px',
                            minWidth: 'unset',
                            p: 0,
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: 'rgba(45,45,45,0.05)',
                                border: '1px solid #2D2D2D',
                                boxShadow: 'none',
                            },
                        }}
                    >
                        LER MAIS
                    </Button>
                </Box>

                {/* ── IMAGEM 1 — steak (topo central) ── */}
                <Box
                    component="img"
                    src="/assets/aboutus/salmon.png"
                    alt="Carne grelhada"
                    sx={{
                        position: { xs: 'static', md: 'absolute' },
                        left: { md: '458px' },
                        top: { md: '12px' },
                        width: { xs: '100%', sm: 'calc(50% - 6px)', md: '260px' },
                        height: { xs: '190px', sm: '220px', md: '244px' },
                        borderRadius: { xs: '12px', md: '15px' },
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block',
                        alignSelf: { xs: 'stretch', sm: 'flex-start' },
                    }}
                />

                {/* ── IMAGEM 2 — chefs (coluna direita) ── */}
                <Box
                    component="img"
                    src="/assets/aboutus/chef.png"
                    alt="Chefs na cozinha"
                    sx={{
                        position: { xs: 'static', md: 'absolute' },
                        right: { md: '12px' },
                        top: { md: '12px' },
                        width: { xs: '100%', sm: 'calc(50% - 6px)', md: '307px' },
                        height: { xs: '240px', sm: '280px', md: '497px' },
                        borderRadius: { xs: '12px', md: '15px' },
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block',
                        alignSelf: { xs: 'stretch', sm: 'flex-end' },
                    }}
                />

                {/* ── IMAGEM 3 — panela (parte inferior) ── */}
                <Box
                    component="img"
                    src="/assets/aboutus/pan.png"
                    alt="Panela com legumes"
                    sx={{
                        position: { xs: 'static', md: 'absolute' },
                        left: { md: '12px' },
                        top: { md: '264px' },
                        right: { md: '331px' },
                        height: { xs: '190px', sm: '220px', md: '247px' },
                        borderRadius: { xs: '12px', md: '15px' },
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block',
                        width: { xs: '100%', md: 'calc(100% - 343px)' },
                    }}
                />
            </Box>
        </Box>
    );
}
