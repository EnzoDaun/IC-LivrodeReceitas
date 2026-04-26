import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FONT_PRIMARY, COLOR_ORANGE } from '@/config/constants/styles';

const stats = [
    { label: 'Total de receitas', value: '0', description: 'Receitas Publicadas' },
    { label: 'Média de avaliações', value: '0.0', description: 'De 5 estrelas' },
    { label: 'Reviews totais', value: '0', description: 'Reviews recebidas' },
];

const orangeBtn = {
    backgroundColor: COLOR_ORANGE,
    borderRadius: '6px',
    color: '#FFFFFF',
    fontFamily: FONT_PRIMARY,
    fontSize: '13px',
    fontWeight: 500,
    textTransform: 'none',
    boxShadow: 'none',
    border: 'none',
    minWidth: 'unset',
    whiteSpace: 'nowrap',
    '&:hover': { backgroundColor: COLOR_ORANGE, boxShadow: 'none' },
};

function StatCard({ label, value, description }) {
    return (
        <Paper elevation={0} sx={{
            flex: 1,
            borderRadius: '9px',
            boxShadow: '0px 3px 13px rgba(0,0,0,0.10)',
            backgroundColor: '#FEFEFD',
            p: '20px 18px',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '22px', fontWeight: 800, color: '#2A2A2A', lineHeight: '26px' }}>
                {label}
            </Typography>
            <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '48px', fontWeight: 800, color: COLOR_ORANGE, lineHeight: '58px', mt: '16px' }}>
                {value}
            </Typography>
            <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '15px', fontWeight: 400, color: '#4A4A4A', lineHeight: '20px', mt: '10px' }}>
                {description}
            </Typography>
        </Paper>
    );
}

const ChefDashboard = () => {
    const navigate = useNavigate();
    const goToAddRecipe = () => navigate('/receitas/adicionar');

    return (
        <>
            {/* ── CABEÇALHO ── */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '9px', mt: '40px' }}>
                <Box
                    component="img"
                    src="/assets/icons/chefIcon.png"
                    alt="Painel do chef"
                    sx={{ width: 44, height: 44, objectFit: 'contain', flexShrink: 0 }}
                />
                <Box>
                    <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '30px', fontWeight: 800, color: '#080C14', lineHeight: '34px', letterSpacing: '-0.5px' }}>
                        Painel do chef
                    </Typography>
                    <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '16px', fontWeight: 400, color: '#222222', lineHeight: '18px' }}>
                        Bem vindo de volta, Chef!
                    </Typography>
                </Box>
            </Box>

            {/* ── CARDS DE MÉTRICAS ── */}
            <Box sx={{ display: 'flex', gap: '30px', mt: '32px' }}>
                {stats.map((s) => (
                    <StatCard key={s.label} {...s} />
                ))}
            </Box>

            {/* ── PAINEL MINHAS RECEITAS ── */}
            <Paper elevation={0} sx={{
                mt: '28px',
                width: '100%',
                height: '84px',
                borderRadius: '9px',
                boxShadow: '0px 3px 13px rgba(0,0,0,0.08)',
                backgroundColor: '#FEFEFD',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: '18px',
                boxSizing: 'border-box',
            }}>
                <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '24px', fontWeight: 800, color: '#2A2A2A', lineHeight: '30px' }}>
                    Minhas Receitas
                </Typography>
                <Button disableElevation disableRipple onClick={goToAddRecipe} sx={{ ...orangeBtn, width: '168px', height: '42px' }}>
                    + Adicionar Nova Receita
                </Button>
            </Paper>

            {/* ── ESTADO VAZIO ── */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: '72px', mb: '60px' }}>
                <Box
                    component="img"
                    src="/assets/icons/noData.png"
                    alt="Nenhuma receita adicionada"
                    sx={{ width: 70, height: 69, objectFit: 'contain', mb: '16px' }}
                />
                <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '24px', fontWeight: 800, color: '#242424', lineHeight: '30px', textAlign: 'center' }}>
                    Você ainda não adicionou receitas
                </Typography>
                <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '15px', fontWeight: 400, color: '#4A4A4A', lineHeight: '17px', textAlign: 'center', mt: '6px' }}>
                    Vamos começar adicionando<br />algumas receitas!
                </Typography>
                <Button disableElevation disableRipple onClick={goToAddRecipe} sx={{ ...orangeBtn, width: '174px', height: '42px', mt: '24px' }}>
                    + Adicionar Nova Receita
                </Button>
            </Box>
        </>
    );
};

export default ChefDashboard;
