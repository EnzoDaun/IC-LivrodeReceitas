import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const FONT = "'Poppins', Inter, system-ui, sans-serif";

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
                height: '523px',
                border: '1px solid #CEC7BA',
                borderRadius: '28px',
                position: 'relative',
                overflow: 'hidden',
                boxSizing: 'border-box',
            }}>

                {/* ── BLOCO DE TEXTO ── */}
                <Box sx={{
                    position: 'absolute',
                    left: '30px',
                    top: '49px',
                    width: '340px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '8px',
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
                            fontFamily: FONT,
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
                        fontFamily: FONT,
                        fontSize: '29px',
                        fontWeight: 900,
                        color: '#2D2D2D',
                        lineHeight: '30px',
                        letterSpacing: '-0.5px',
                        textTransform: 'uppercase',
                    }}>
                        NOSSA HISTÓRIA<br />E PROPÓSITO
                    </Typography>

                    {/* Parágrafo */}
                    <Typography sx={{
                        fontFamily: FONT,
                        fontSize: '12px',
                        fontWeight: 400,
                        color: '#4F4F4F',
                        lineHeight: '17px',
                        maxWidth: '260px',
                    }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum,ac aliquet odio mattis.
                    </Typography>

                    {/* Botão */}
                    <Button
                        disableElevation
                        disableRipple
                        sx={{
                            mt: '4px',
                            width: '82px',
                            height: '28px',
                            border: '1px solid #2D2D2D',
                            borderRadius: '999px',
                            backgroundColor: 'transparent',
                            color: '#2D2D2D',
                            fontFamily: FONT,
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
                        position: 'absolute',
                        left: '458px',
                        top: '12px',
                        width: '260px',
                        height: '244px',
                        borderRadius: '15px',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block',
                    }}
                />

                {/* ── IMAGEM 2 — chefs (coluna direita) ── */}
                <Box
                    component="img"
                    src="/assets/aboutus/chef.png"
                    alt="Chefs na cozinha"
                    sx={{
                        position: 'absolute',
                        right: '12px',
                        top: '12px',
                        width: '307px',
                        height: '497px',
                        borderRadius: '15px',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block',
                    }}
                />

                {/* ── IMAGEM 3 — panela (parte inferior) ── */}
                <Box
                    component="img"
                    src="/assets/aboutus/pan.png"
                    alt="Panela com legumes"
                    sx={{
                        position: 'absolute',
                        left: '12px',
                        top: '264px',
                        right: '331px',
                        height: '247px',
                        borderRadius: '15px',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block',
                        width: 'calc(100% - 343px)',
                    }}
                />
            </Box>
        </Box>
    );
}
