import React, { useState } from 'react';
import { Box, Typography, Paper, TextField } from '@mui/material';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { primaryNavigationLinks } from '../config/navigation';

const FONT = "'Poppins', Inter, system-ui, sans-serif";
const ORANGE = '#FF9900';

const cardSx = {
    width: '100%',
    borderRadius: '7px',
    boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
    backgroundColor: '#FFFFFF',
    p: '20px 20px 24px 20px',
    boxSizing: 'border-box',
};

const inputSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '6px',
        backgroundColor: '#FFFFFF',
        '& fieldset': {
            borderColor: '#8FA0B7',
            borderWidth: '1px',
            top: 0,
        },
        '& fieldset legend': { display: 'none' },
        '&:hover fieldset': { borderColor: '#8FA0B7' },
        '&.Mui-focused fieldset': { borderColor: '#8FA0B7', borderWidth: '1px' },
    },
    '& .MuiOutlinedInput-input': {
        p: '0 12px',
        fontFamily: FONT,
        fontSize: '14px',
        color: '#111111',
    },
};

function SectionTitle({ children }) {
    return (
        <Typography sx={{ fontFamily: FONT, fontSize: '18px', fontWeight: 800, color: '#222222', mb: '16px' }}>
            {children}
        </Typography>
    );
}

function FieldLabel({ children, sx: extraSx }) {
    return (
        <Typography sx={{ fontFamily: FONT, fontSize: '13px', fontWeight: 700, color: '#222222', mb: '5px', ...extraSx }}>
            {children}
        </Typography>
    );
}

function FormField({ label, height = 40, multiline = false, rows, sx: extraSx }) {
    return (
        <Box>
            <FieldLabel>{label}</FieldLabel>
            <TextField
                variant="outlined"
                fullWidth
                multiline={multiline}
                rows={rows}
                sx={{
                    ...inputSx,
                    '& .MuiOutlinedInput-input': {
                        ...inputSx['& .MuiOutlinedInput-input'],
                        height: multiline ? 'auto' : `${height}px`,
                        p: multiline ? '10px 12px' : '0 12px',
                    },
                    '& .MuiInputBase-root': { height: multiline ? 'auto' : `${height}px` },
                    ...extraSx,
                }}
            />
        </Box>
    );
}

function StepSection({ title, addLabel }) {
    const [items, setItems] = useState(['']);

    return (
        <Paper elevation={0} sx={cardSx}>
            <SectionTitle>{title}</SectionTitle>
            <Box sx={{ pl: '28px' }}>
                <FieldLabel>Procurar receitas</FieldLabel>
            </Box>
            {items.map((_, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: '6px', mb: '6px' }}>
                    <Typography sx={{ fontFamily: FONT, fontSize: '14px', fontWeight: 500, color: '#222222', flexShrink: 0, width: '22px' }}>
                        {i + 1}.
                    </Typography>
                    <TextField
                        variant="outlined"
                        fullWidth
                        sx={{
                            ...inputSx,
                            '& .MuiInputBase-root': { height: '40px' },
                            '& .MuiOutlinedInput-input': {
                                ...inputSx['& .MuiOutlinedInput-input'],
                                height: '40px',
                            },
                        }}
                    />
                </Box>
            ))}
            <Typography
                onClick={() => setItems([...items, ''])}
                sx={{ fontFamily: FONT, fontSize: '13px', fontWeight: 700, color: ORANGE, cursor: 'pointer', mt: '12px', pl: '28px' }}
            >
                {addLabel}
            </Typography>
        </Paper>
    );
}

const AddRecipePage = () => {
    const handleSearch = (query) => console.log('Pesquisando por:', query);

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', py: '28px', px: { xs: 2, md: 3 } }}>
            <Navbar links={primaryNavigationLinks} onSearch={handleSearch} initialActiveLink="Receitas" />

            <Box sx={{ maxWidth: '680px', mt: '32px', mx: 'auto' }}>
                {/* ── CABEÇALHO ── */}
                <Box sx={{ mb: '16px' }}>
                    <Typography sx={{ fontFamily: FONT, fontSize: '24px', fontWeight: 800, color: '#111111', lineHeight: '28px' }}>
                        + Adicionar nova receita
                    </Typography>
                    <Typography sx={{ fontFamily: FONT, fontSize: '14px', fontWeight: 400, color: '#333333', lineHeight: '18px' }}>
                        Compartilhe suas receitas com o mundo
                    </Typography>
                </Box>

                {/* ── CARD 1: INFORMAÇÕES BÁSICAS ── */}
                <Paper elevation={0} sx={{ ...cardSx, mb: '12px' }}>
                    <SectionTitle>Informações básicas</SectionTitle>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <FormField label="Título da receita" height={26} />
                        <FormField label="Descrição" multiline rows={2} />
                        <Box sx={{ display: 'flex', gap: '16px' }}>
                            <Box sx={{ flex: 1 }}>
                                <FormField label="Categoria" height={26} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <FormField label="Dificuldade" height={26} />
                            </Box>
                        </Box>
                        <Box sx={{ width: 'calc(50% - 8px)' }}>
                            <FormField label="Tempo de preparo" height={26} />
                        </Box>
                    </Box>
                </Paper>

                {/* ── CARD 2: IMAGENS ── */}
                <Paper elevation={0} sx={{ ...cardSx, mb: '12px' }}>
                    <SectionTitle>Imagens</SectionTitle>
                    <Box sx={{
                        width: '100%',
                        height: '126px',
                        border: '1px dashed #777777',
                        borderRadius: '5px',
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                    }}>
                        <Typography sx={{ fontSize: '28px', mb: '8px', lineHeight: 1 }}>📷</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Typography sx={{ fontFamily: FONT, fontSize: '13px', fontWeight: 700, color: ORANGE }}>
                                Clique aqui
                            </Typography>
                            <Typography sx={{ fontFamily: FONT, fontSize: '13px', fontWeight: 700, color: '#222222' }}>
                                ou arraste a imagem para inserir
                            </Typography>
                        </Box>
                        <Typography sx={{ fontFamily: FONT, fontSize: '12px', fontWeight: 400, color: '#666666', mt: '4px' }}>
                            PNG, JPG até 10MB
                        </Typography>
                        <Typography sx={{ fontFamily: FONT, fontSize: '10px', fontWeight: 400, color: '#9A9A9A', mt: '3px' }}>
                            0 de 5 imagens inseridas
                        </Typography>
                    </Box>
                </Paper>

                {/* ── CARD 3: INGREDIENTES ── */}
                <Box sx={{ mb: '12px' }}>
                    <StepSection title="Ingredientes" addLabel="+ Adicionar Ingrediente" />
                </Box>

                {/* ── CARD 4: INSTRUÇÕES ── */}
                <StepSection title="Instruções" addLabel="+ Adicionar Instrução" />
            </Box>

            <Footer />
        </Box>
    );
};

export default AddRecipePage;
