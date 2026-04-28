import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
    Instagram as InstagramIcon,
    MailOutline as MailOutlineIcon,
    YouTube as YouTubeIcon,
} from '@mui/icons-material';
import Chapter from '@/components/Ebook/Chapter';
import DialogReceberEbook from '@/components/Ebook/DialogReceberEbook';
import EbookValues from '@/components/Ebook/EbookValues';
import { FONT_SANS } from '@/config/constants/styles';
import { socialLinks } from '@/config/socialLinks';

const socialIconByName = {
    instagram: InstagramIcon,
    youtube: YouTubeIcon,
};

// ─── Dados ────────────────────────────────────────────────────────────────────

const ebookSections = [
    { id: 'ebook-section-1', label: 'Bloco 1', background: (theme) => alpha(theme.palette.background.paper, 1) },
    { id: 'ebook-section-2', label: 'Bloco 2', background: (theme) => alpha(theme.palette.background.default, 1) },
    { id: 'ebook-section-3', label: 'Bloco 3', background: (theme) => alpha(theme.palette.background.paper, 1) },
    { id: 'ebook-section-4', label: 'Bloco 4', background: (theme) => alpha(theme.palette.background.default, 1) },
    { id: 'ebook-section-5', label: 'Bloco 5', background: 'linear-gradient(135deg, #102313 0%, #1F3D21 48%, #0B1D11 100%)' },
    { id: 'ebook-section-6', label: 'Bloco 6', background: (theme) => alpha(theme.palette.background.paper, 1) },
];

const chapterContentSx = {
    p: { xs: 0, sm: 3, md: '40px' },
    width: '100%',
    maxWidth: 1100,
    mx: 'auto',
    boxSizing: 'border-box',
};

// ─── Componente ───────────────────────────────────────────────────────────────

const EbookContent = () => {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <>
            {/* ── SEÇÕES ── */}
            <Box component="main" sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                {ebookSections.map((section, index) => {
                    const sectionIndex = index + 1;
                    return (
                        <Box
                            key={section.id}
                            component="section"
                            sx={{ minHeight: { xs: 360, md: 480 }, px: { xs: 2.5, md: 4 }, py: { xs: 3, md: 4 }, background: section.background, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            {/* ── CAPÍTULO 1 ── */}
                            {sectionIndex === 1 ? (
                                <Box sx={chapterContentSx}>
                                    <Chapter
                                        chapterNumber="1"
                                        title="Onde tudo começa: afeto, memória e propósito"
                                        text="Minha paixão pela gastronomia começou cedo, com o cheiro da lenha queimando e o calor da cozinha do sítio onde minha avó morava. Durante as férias de inverno, eu acompanhava cada movimento dela, fascinado com a maneira como cozinhava — sem pressa, sem desperdício, com o que havia disponível e sempre com muito carinho. No fogão a lenha, cada receita tinha um tempo, um cuidado e um sabor que se tornaram inesquecíveis. Foi ali, naquele cenário simples e cheio de vida, que aprendi que cozinhar é mais do que preparar alimentos: é um ato de cuidado, de memória e de conexão com a terra e com as pessoas."
                                    />
                                </Box>

                                /* ── SEÇÃO AUTORAL ── */
                            ) : sectionIndex === 2 ? (
                                <Box sx={{ ...chapterContentSx, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '360px 1fr' }, alignItems: 'flex-start', gap: { xs: 4, md: 6 } }}>
                                    <Box sx={{ width: '100%', maxWidth: { xs: 360, md: '100%' }, mx: { xs: 'auto', md: 0 }, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5 }}>
                                        <Box
                                            component="img"
                                            src="/assets/recipes/RecipeImage.png"
                                            alt="Cozinha afetiva"
                                            sx={{ width: '100%', aspectRatio: '3 / 4.6', objectFit: 'cover', borderRadius: { xs: '8px', md: '20px' }, boxShadow: '0 18px 42px rgba(45, 45, 45, 0.14)', display: 'block' }}
                                        />
                                        <Box sx={{ width: '100%', border: `1px solid ${alpha('#000000', 0.28)}`, backgroundColor: alpha('#FFFFF', 0.14), borderRadius: { xs: '8px', md: '20px' }, px: { xs: 2, md: 2.5 }, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, boxSizing: 'border-box' }}>
                                            <Typography variant="body2" sx={{ fontFamily: FONT_SANS, color: 'text.primary', fontWeight: 600, fontSize: { xs: '13px', md: '14px' }, lineHeight: 1, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                                                Siga-me
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: { xs: 1, sm: 1.5 }, flexWrap: 'wrap' }}>
                                                {socialLinks.map(({ label, href, icon }) => {
                                                    const SocialIcon = socialIconByName[icon];
                                                    return (
                                                        <Box
                                                            key={label}
                                                            component="a"
                                                            href={href}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            aria-label={label}
                                                            sx={{
                                                                width: 30,
                                                                height: 30,
                                                                color: 'text.primary',
                                                                display: 'grid',
                                                                placeItems: 'center',
                                                                textDecoration: 'none',
                                                                '&:hover': { color: 'sustainable.dark', backgroundColor: alpha('#2D4B27', 0.08) },
                                                            }}
                                                        >
                                                            <SocialIcon sx={{ fontSize: 20 }} />
                                                        </Box>
                                                    );
                                                })}
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', gap: { xs: 2, md: 2.5 } }}>
                                        <Typography variant="h2" sx={{ fontFamily: 'Georgia, "Times New Roman", serif', color: 'text.primary', fontWeight: 700, fontSize: { xs: '34px', sm: '40px', md: '52px' }, lineHeight: 1.1 }}>
                                            Da cozinha ao propósito
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontFamily: FONT_SANS, color: 'text.primary', fontSize: { xs: '15px', sm: '17px', md: '20px' }, lineHeight: 1.6 }}>
                                            Este livro nasce do resgate de tudo aquilo que aprendi observando minha avó e da vontade de unir essa herança afetiva com um propósito atual: o aproveitamento integral dos alimentos. Cada receita convida a olhar para os ingredientes com mais respeito e criatividade.
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontFamily: FONT_SANS, color: 'text.primary', fontSize: { xs: '15px', sm: '17px', md: '20px' }, lineHeight: 1.6 }}>
                                            Cascas, talos, sementes, sobras — tudo tem valor quando sabemos como transformar. Que estas páginas inspirem não apenas novas preparações, mas também um novo olhar: mais sensível, mais consciente e, acima de tudo, mais amoroso para a cozinha e para o mundo.
                                        </Typography>
                                    </Box>
                                </Box>

                                /* ── CAPÍTULO 2 — GASTRONOMIA AFETIVA ── */
                            ) : sectionIndex === 3 ? (
                                <Box sx={chapterContentSx}>
                                    <Chapter
                                        chapterNumber="2"
                                        title="Gastronomia afetiva: sabores que contam histórias"
                                        showText={false}
                                    />
                                    <Box sx={{ mt: { xs: 2.5, md: 3 }, width: '100%', backgroundColor: 'background.defaultDark', borderRadius: { xs: '8px', md: '20px' }, px: { xs: 2, sm: 3.5, md: 5 }, py: { xs: 3, sm: 3.5, md: 5 }, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: { xs: 2, md: 2.5 }, boxSizing: 'border-box' }}>
                                        <Typography variant="body1" sx={{ width: '100%', fontFamily: FONT_SANS, color: 'text.primary', fontSize: { xs: '15px', sm: '17px', md: '20px' }, lineHeight: 1.6, textAlign: 'justify' }}>
                                            A gastronomia não se limita ao ato de nutrir o corpo; ela também se apresenta como um fenômeno cultural, social e afetivo. A memória gustativa é uma construção coletiva que se ancora em experiências individuais, mas ganha sentido na relação com o outro. A gastronomia afetiva emerge como um campo que conecta alimentos, memórias e afetos, revelando a potência simbólica da culinária no fortalecimento de identidades e vínculos sociais.
                                        </Typography>
                                        <Typography variant="body1" sx={{ width: '100%', fontFamily: FONT_SANS, color: 'text.primary', fontSize: { xs: '15px', sm: '17px', md: '20px' }, lineHeight: 1.6, textAlign: 'justify' }}>
                                            O sabor de uma receita pode evocar lembranças de infância, de encontros familiares ou de momentos de celebração. Cozinhar e partilhar alimentos não apenas alimenta — recria narrativas de pertencimento e continuidade cultural. A afetividade no alimento é mediada pela memória afetiva, onde experiências sensoriais se transformam em significados únicos e insubstituíveis.
                                        </Typography>
                                        <Box sx={{ width: '100%', backgroundColor: 'background.paper', borderRadius: { xs: '8px', md: '20px' }, px: { xs: 2.5, sm: 3, md: 3.5 }, py: { xs: 2.5, md: 3 }, textAlign: 'left', boxShadow: (theme) => `-6px 0 0 0 ${theme.palette.sustainable.main}`, boxSizing: 'border-box' }}>
                                            <Typography variant="h6" component="blockquote" sx={{ m: 0, fontFamily: 'Georgia, "Times New Roman", serif', color: 'text.primary', fontWeight: 700, fontSize: { xs: '17px', sm: '18px', md: '20px' }, lineHeight: 1.35 }}>
                                                "A comida é uma linguagem — um código através do qual sociedades expressam valores, tradições e afetos."
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 1.5, fontFamily: FONT_SANS, color: 'text.secondary', fontWeight: 300, fontSize: { xs: '15px', sm: '17px', md: '20px' }, lineHeight: 1.4 }}>
                                                — Massimo Montanari, Comida como Cultura (2013)
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                /* ── CAPÍTULO 3 — APROVEITAMENTO INTEGRAL ── */
                            ) : sectionIndex === 4 ? (
                                <Box sx={chapterContentSx}>
                                    <Chapter
                                        chapterNumber="3"
                                        title="Por que o aproveitamento integral importa hoje"
                                        text="O ato de se alimentar vai muito além da simples ingestão de nutrientes — trata-se de um processo permeado por dimensões sociais, culturais, ambientais e políticas. Vivemos em uma era marcada por paradoxos: de um lado, a fome que persiste como desafio global; de outro, o desperdício de alimentos em proporções alarmantes. Aproximadamente um terço de todos os alimentos produzidos no mundo é desperdiçado anualmente, ao mesmo tempo em que mais de 828 milhões de pessoas enfrentam insegurança alimentar. O aproveitamento integral é uma prática urgente e necessária — ao utilizar cascas, talos e sementes, é possível não apenas ampliar o valor nutricional das refeições, mas também questionar modelos de consumo que reforçam desigualdades e impactos ambientais."
                                    />
                                </Box>

                                /* ── VALORES ── */
                            ) : sectionIndex === 5 ? (
                                <EbookValues />

                                /* ── CTA — RECEBER E-BOOK ── */
                            ) : sectionIndex === 6 ? (
                                <Box sx={{ backgroundColor: 'background.defaultDark', borderRadius: { xs: '8px', md: '20px' }, mt: { xs: 2.5, md: 5 }, width: '100%', maxWidth: 680, mx: 'auto', px: { xs: 2.5, sm: 4, md: 5 }, py: { xs: 3.5, md: 5 }, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: 2, md: 2.5 } }}>
                                    <Typography variant="h2" sx={{ fontFamily: 'Georgia, "Times New Roman", serif', color: 'text.primary', fontWeight: 700, fontSize: { xs: '30px', sm: '36px', md: '48px' }, lineHeight: 1.1 }}>
                                        Faça Parte Desta Jornada
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontFamily: FONT_SANS, color: 'text.primary', fontSize: { xs: '15px', sm: '17px', md: '20px' }, lineHeight: 1.6 }}>
                                        Receba gratuitamente o e-book <em>Raízes e sabores</em> e descubra como transformar cada parte do alimento em uma refeição cheia de afeto, sabor e propósito.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        onClick={() => setDialogOpen(true)}
                                        startIcon={<MailOutlineIcon />}
                                        sx={{ mt: 1, width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 300 }, px: { xs: 2.5, sm: 8, md: 10 }, py: { xs: 1.1, md: 1.25 }, backgroundColor: (theme) => alpha(theme.palette.sustainable.main, 0.74), color: 'sustainable.contrastText', borderRadius: '45px', fontFamily: FONT_SANS, fontWeight: 500, fontSize: { xs: '16px', sm: '18px', md: '20px' }, textTransform: 'none', boxShadow: 'none', '&:hover': { backgroundColor: 'sustainable.dark', boxShadow: 'none' } }}
                                    >
                                        Receber e-book
                                    </Button>
                                </Box>
                            ) : (
                                <Typography variant="h6" component="h2" sx={{ fontFamily: FONT_SANS, color: 'text.primary', fontWeight: 600, fontSize: { xs: '18px', md: '20px' } }}>
                                    {section.label}
                                </Typography>
                            )}
                        </Box>
                    );
                })}
            </Box>

            <DialogReceberEbook open={dialogOpen} onClose={() => setDialogOpen(false)} />
        </>
    );
};

export default EbookContent;
