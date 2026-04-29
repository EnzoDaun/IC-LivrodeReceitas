import { FONT_PRIMARY } from '@/config/constants/styles';
import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
import {
    AutoStories as BookIcon,
    EnergySavingsLeaf as LeafIcon,
    Favorite as HeartIcon,
    Recycling as RecyclingIcon,
} from '@mui/icons-material';



const PILLARS = [
    {
        icon: RecyclingIcon,
        color: 'sustainable.main',
        title: 'Aproveitamento Integral',
        text: 'Cascas, talos, sementes e sobras como protagonistas — 1/3 dos alimentos produzidos no mundo é descartado anualmente.',
    },
    {
        icon: HeartIcon,
        color: 'primary.main',
        title: 'Memória Afetiva',
        text: 'Receitas que resgatam vínculos intergeracionais e promovem bem-estar emocional e pertencimento cultural.',
    },
    {
        icon: LeafIcon,
        color: 'secondary.main',
        title: 'Sustentabilidade',
        text: 'Alimentação como ato de responsabilidade coletiva, reduzindo impactos sobre o meio ambiente.',
    },
    {
        icon: BookIcon,
        color: 'primary.main',
        title: 'Educação Alimentar',
        text: 'Valorização do alimento em sua totalidade, promovendo escolhas conscientes e transformação social.',
    },
];

const TEAM_GROUPS = [
    { role: 'Mestrando', color: 'primary.main', names: ['Jean Carlos Soares da Silva'] },
    { role: 'Desenvolvedores', color: 'primary.main', names: ['Enzo Shimada Daun', 'Marco Antônio Lonardon Júnior'] },
    { role: 'Orientação', color: 'sustainable.main', names: ['Prof. Dr. Edilson Carlos Caritá', 'Profª. Drª. Silvia Sidnéia da Silva'] },
];

const Badge = ({ label, color = 'primary.main' }) => (
    <Box sx={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: color,
        borderRadius: '999px',
        px: '12px',
        height: '20px',
        alignSelf: 'flex-start',
    }}>
        <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '10px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.4px', lineHeight: 1 }}>
            {label}
        </Typography>
    </Box>
);

export default function SobreNos() {
    return (
        <Box sx={{ width: '100%', mt: '40px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* ════ BLOCO 1 — HERO ════ */}
            <Box sx={{
                border: '1px solid #CEC7BA',
                borderRadius: '28px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                backgroundColor: 'background.paper',
                minHeight: { xs: 'auto', md: '400px' },
            }}>
                {/* Texto */}
                <Box sx={{ flex: 1, p: { xs: '36px 28px', md: '52px 48px' }, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
                    <Badge label="Nossa origem" />
                    <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: { xs: '28px', md: '36px' }, fontWeight: 900, color: 'text.primary', lineHeight: 1.05, letterSpacing: '-1px', textTransform: 'uppercase' }}>
                        Raízes e sabores:<br />afeto em cada parte<br />do alimento
                    </Typography>
                    <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '13px', color: 'text.secondary', lineHeight: '22px', maxWidth: '420px' }}>
                        Tudo começou com o cheiro da lenha e o calor da cozinha do sítio. Observando a avó no fogão a lenha — sem pressa, sem desperdício, com o que havia disponível — aprendi que cozinhar é mais do que preparar alimentos: é um ato de cuidado, de memória e de conexão com a terra e com as pessoas.
                    </Typography>
                    <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '13px', color: 'text.secondary', lineHeight: '22px', maxWidth: '420px' }}>
                        Este projeto nasce desse lugar e da vontade de unir essa herança afetiva com um propósito atual: o <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>aproveitamento integral dos alimentos</Box>. Cascas, talos, sementes, sobras — tudo tem valor quando sabemos como transformar.
                    </Typography>
                </Box>
                {/* Imagem */}
                <Box component="img" src="/assets/aboutus/IMG_5589.png" alt="Prato afetivo"
                    sx={{ width: { xs: '100%', md: '340px' }, height: { xs: '220px', md: 'auto' }, objectFit: 'cover', objectPosition: 'center', flexShrink: 0 }}
                />
            </Box>

            {/* ════ BLOCO 2 — PILARES (cards separados) ════ */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '14px' }}>
                {PILLARS.map((p) => {
                    const Icon = p.icon;
                    return (
                        <Box key={p.title} sx={{
                            flex: 1,
                            minWidth: 0,
                            border: '1px solid #CEC7BA',
                            borderRadius: '20px',
                            p: '24px',
                            backgroundColor: 'background.paper',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                        }}>
                            <Box sx={{ width: 38, height: 38, borderRadius: '10px', backgroundColor: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Icon sx={{ fontSize: 18, color: '#fff' }} />
                            </Box>
                            <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '14px', fontWeight: 700, color: 'text.primary', lineHeight: 1.3, letterSpacing: '-0.2px' }}>
                                {p.title}
                            </Typography>
                            <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '12px', color: 'text.secondary', lineHeight: '18px' }}>
                                {p.text}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>

            {/* ════ BLOCO 3 — GASTRONOMIA AFETIVA + EQUIPE (lado a lado) ════ */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '14px' }}>

                {/* Esquerda — Gastronomia Afetiva */}
                <Box sx={{
                    flex: 1,
                    border: '1px solid #CEC7BA',
                    borderRadius: '28px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'background.paper',
                }}>
                    <Box sx={{ p: { xs: '28px', md: '36px 36px 24px' }, display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                        <Badge label="Gastronomia Afetiva" color="primary.main" />
                        <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: { xs: '18px', md: '22px' }, fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                            Sabores que contam histórias
                        </Typography>
                        <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '13px', color: 'text.secondary', lineHeight: '22px' }}>
                            A gastronomia afetiva conecta alimentos, memórias e afetos, revelando a potência simbólica da culinária no fortalecimento de identidades e vínculos sociais. O sabor de uma receita pode evocar lembranças de infância, de encontros familiares ou de momentos de celebração.
                        </Typography>
                        <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '13px', color: 'text.secondary', lineHeight: '22px' }}>
                            Como afirma Montanari (2013), <Box component="em">a comida é uma linguagem</Box> — um código através do qual sociedades expressam valores, tradições e afetos. Cada receita deste livro carrega essa dimensão: técnica culinária entrelaçada com oralidade, emoção e memória coletiva.
                        </Typography>
                    </Box>
                    <Box component="img" src="/assets/aboutus/IMG_5593.png" alt="Chef na cozinha"
                        sx={{ width: '100%', height: '200px', objectFit: 'cover', objectPosition: 'center 60%', display: 'block' }}
                    />
                </Box>

                {/* Direita — Projeto Acadêmico */}
                <Box sx={{
                    width: { xs: '100%', md: '320px' },
                    flexShrink: 0,
                    border: '1px solid #CEC7BA',
                    borderRadius: '28px',
                    backgroundColor: 'background.paper',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}>
                    {/* Faixa verde topo */}
                    <Box sx={{ backgroundColor: 'sustainable.main', px: '28px', py: '24px' }}>
                        <Badge label="Mestrado" color="rgba(255,255,255,0.2)" />
                        <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '20px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.2, mt: '10px', textTransform: 'uppercase' }}>
                            Projeto de<br />Mestrado
                        </Typography>
                        <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '12px', color: 'rgba(255,255,255,0.75)', lineHeight: '18px', mt: '8px' }}>
                            Plataforma que integra gastronomia afetiva, aproveitamento integral dos alimentos e tecnologia para criar uma ferramenta prática e transformadora.
                        </Typography>
                    </Box>

                    {/* Lista da equipe */}
                    <Box sx={{ px: '24px', py: '20px', display: 'flex', flexDirection: 'column', gap: '0px', flex: 1 }}>
                        <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '10px', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', mb: '14px' }}>
                            Equipe
                        </Typography>
                        {TEAM_GROUPS.map((group, i) => (
                            <React.Fragment key={group.role}>
                                <Box sx={{ py: '10px' }}>
                                    <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '10px', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.4px', mb: '6px' }}>
                                        {group.role}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        {group.names.map((name) => (
                                            <Typography key={name} sx={{ fontFamily: FONT_PRIMARY, fontSize: '14px', fontWeight: 400, color: 'text.primary', letterSpacing: '-0.2px', lineHeight: 1.4 }}>
                                                {name}
                                            </Typography>
                                        ))}
                                    </Box>
                                </Box>
                                {i < TEAM_GROUPS.length - 1 && <Divider sx={{ borderColor: '#E8E1D8' }} />}
                            </React.Fragment>
                        ))}
                    </Box>
                </Box>
            </Box>

        </Box>
    );
}
