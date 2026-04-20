import React from 'react';
import {Box, Button, IconButton, Typography} from '@mui/material';
import {alpha} from '@mui/material/styles';
import {Link as RouterLink} from 'react-router-dom';
import {
    EnergySavingsLeaf as EnergySavingsLeafIcon,
    Facebook as FacebookIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Instagram as InstagramIcon,
    MusicNote as MusicNoteIcon,
    Restaurant as RestaurantIcon,
    YouTube as YouTubeIcon,
} from '@mui/icons-material';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Chapter from '../components/Chapter/Chapter';
import {primaryNavigationLinks} from '../config/navigation';

const sansSerifFont = 'Montserrat, Poppins, sans-serif';

const ebookSections = [
    {
        id: 'ebook-section-1',
        label: 'Bloco 1',
        background: (theme) => alpha(theme.palette.background.paper, 1),
    },
    {
        id: 'ebook-section-2',
        label: 'Bloco 2',
        background: (theme) => alpha(theme.palette.background.default, 1),
    },
    {
        id: 'ebook-section-3',
        label: 'Bloco 3',
        background: (theme) => alpha(theme.palette.background.paper, 1),
    },
    {
        id: 'ebook-section-4',
        label: 'Bloco 4',
        background: (theme) => alpha(theme.palette.background.default, 1),
    },
    {
        id: 'ebook-section-5',
        label: 'Bloco 5',
        background: 'linear-gradient(135deg, #102313 0%, #1F3D21 48%, #0B1D11 100%)',
    },
    {
        id: 'ebook-section-6',
        label: 'Bloco 6',
        background: (theme) => alpha(theme.palette.background.paper, 1),
    },
];

const valueColumns = [
    {
        title: 'Respeito',
        text: 'Valorizar cada ingrediente, evitando desperdicios e aproveitando melhor o que a natureza oferece.',
        icon: EnergySavingsLeafIcon,
    },
    {
        title: 'Cuidado',
        text: 'Preparar alimentos com atencao, afeto e consciencia sobre o impacto de cada escolha.',
        icon: FavoriteBorderIcon,
    },
    {
        title: 'Equilibrio',
        text: 'Unir sabor, praticidade e responsabilidade para transformar a rotina na cozinha.',
        icon: RestaurantIcon,
    },
];

const authorSocialLinks = [
    {label: 'TikTok', href: '#', icon: MusicNoteIcon},
    {label: 'Facebook', href: '#', icon: FacebookIcon},
    {label: 'Instagram', href: '#', icon: InstagramIcon},
    {label: 'YouTube', href: '#', icon: YouTubeIcon},
];

const chapterContentSx = {
    p: {xs: 0, sm: 3, md: '40px'},
    width: '100%',
    maxWidth: 1100,
    mx: 'auto',
    boxSizing: 'border-box',
};

const EbookPage = () => {
    const handleSearch = (query) => {
        console.log('Pesquisando por:', query);
    };

    return (
        <Box>
            <Box
                component="section"
                sx={{
                    backgroundImage: 'url(/assets/ebookImages/EbookBackgroundImage.png)',
                    backgroundSize: '60% auto',
                    backgroundPosition: 'bottom center',
                    backgroundRepeat: 'repeat',
                }}
            >
                <Box
                    sx={{
                        maxWidth: 1100,
                        mx: 'auto',
                        px: {xs: 2, md: 3},
                        pt: '28px',
                    }}
                >
                    <Navbar
                        links={primaryNavigationLinks}
                        onSearch={handleSearch}
                        initialActiveLink="E-book"
                    />
                </Box>

                <Box
                    sx={{
                        minHeight: {xs: 360, md: 480},
                        px: {xs: 2.5, md: 4},
                        py: {xs: 3, md: 4},
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        sx={{
                            maxWidth: 840,
                            mx: 'auto',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <Typography
                            variant="body1"
                            sx={{
                                fontFamily: sansSerifFont,
                                px: {xs: 3, md: 5},
                                py: 1.5,
                                backgroundColor: (theme) => alpha(theme.palette.sustainable.main, 0.74),
                                borderRadius: '90px',
                                color: 'sustainable.contrastText',
                                fontWeight: 600,
                                fontSize: {xs: '16px', md: '18px'},
                            }}
                        >
                            Nossa Jornada Sustentavel
                        </Typography>
                        <Typography
                            variant="h1"
                            sx={{
                                fontFamily: 'Georgia, "Times New Roman", serif',
                                color: 'text.primary',
                                fontWeight: 700,
                                fontSize: {xs: '34px', md: '54px'},
                                lineHeight: 1,
                            }}
                        >
                            A Historia de Uma Cozinha Consciente
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                fontFamily: sansSerifFont,
                                color: 'text.primary',
                                fontSize: {xs: '16px', md: '20px'},
                                lineHeight: 1.5,
                                maxWidth: 680,
                            }}
                        >
                            Uma jornada de descoberta, amor pela natureza e compromisso com o planeta
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box
                component="main"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                }}
            >
                {ebookSections.map((section, index) => {
                    const sectionIndex = index + 1;

                    return (
                        <Box
                            key={section.id}
                            component="section"
                            sx={{
                                minHeight: {xs: 360, md: 480},
                                px: {xs: 2.5, md: 4},
                                py: {xs: 3, md: 4},
                                background: section.background,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {sectionIndex === 1 ? (
                                <Box
                                    sx={chapterContentSx}
                                >
                                    <Chapter
                                        chapterNumber="1"
                                        title="Titulo do capítulo"
                                        text="Texto do capítulo."
                                    />
                                </Box>
                            ) : sectionIndex === 2 ? (
                                <Box
                                    sx={{
                                        ...chapterContentSx,
                                        display: 'grid',
                                        gridTemplateColumns: {xs: '1fr', md: '360px 1fr'},
                                        alignItems: 'flex-start',
                                        gap: {xs: 4, md: 6},
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: '100%',
                                            maxWidth: {xs: 360, md: '100%'},
                                            mx: {xs: 'auto', md: 0},
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 2.5,
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src="/assets/RecipeImage.png"
                                            alt="Placeholder vertical"
                                            sx={{
                                                width: '100%',
                                                aspectRatio: '3 / 4.6',
                                                objectFit: 'cover',
                                                borderRadius: {xs: '8px', md: '20px'},
                                                boxShadow: '0 18px 42px rgba(45, 45, 45, 0.14)',
                                                display: 'block',
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                width: '100%',
                                                border: `1px solid ${alpha('#000000', 0.28)}`,
                                                backgroundColor: alpha('#FFFFF', 0.14),
                                                borderRadius: {xs: '8px', md: '20px'},
                                                px: {xs: 2, md: 2.5},
                                                py: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: 1.5,
                                                boxSizing: 'border-box',
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontFamily: sansSerifFont,
                                                    color: 'text.primary',
                                                    fontWeight: 600,
                                                    fontSize: {xs: '13px', md: '14px'},
                                                    lineHeight: 1,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: 0,
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                Siga-me
                                            </Typography>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-end',
                                                    gap: {xs: 0.5, sm: 0.75},
                                                }}
                                            >
                                                {authorSocialLinks.map(({label, href, icon: SocialIcon}) => (
                                                    <IconButton
                                                        key={label}
                                                        component="a"
                                                        href={href}
                                                        aria-label={label}
                                                        sx={{
                                                            width: 30,
                                                            height: 30,
                                                            color: 'text.primary',
                                                            p: 0,
                                                            '&:hover': {
                                                                color: 'sustainable.dark',
                                                                backgroundColor: alpha('#2D4B27', 0.08),
                                                            },
                                                        }}
                                                    >
                                                        <SocialIcon sx={{fontSize: 20}} />
                                                    </IconButton>
                                                ))}
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            textAlign: 'left',
                                            gap: {xs: 2, md: 2.5},
                                        }}
                                    >
                                        <Typography
                                            variant="h2"
                                            sx={{
                                                fontFamily: 'Georgia, "Times New Roman", serif',
                                                color: 'text.primary',
                                                fontWeight: 700,
                                                fontSize: {xs: '34px', sm: '40px', md: '52px'},
                                                lineHeight: 1.1,
                                                letterSpacing: 0,
                                            }}
                                        >
                                            Da Cozinha ao Proposito
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontFamily: sansSerifFont,
                                                color: 'text.primary',
                                                fontSize: {xs: '15px', sm: '17px', md: '20px'},
                                                lineHeight: 1.6,
                                                letterSpacing: 0,
                                            }}
                                        >
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                                            tincidunt, nibh sed feugiat fermentum, arcu urna posuere lectus, vitae
                                            luctus lectus justo non arcu.
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontFamily: sansSerifFont,
                                                color: 'text.primary',
                                                fontSize: {xs: '15px', sm: '17px', md: '20px'},
                                                lineHeight: 1.6,
                                                letterSpacing: 0,
                                            }}
                                        >
                                            Donec convallis, mi a gravida viverra, tortor justo pretium risus, sed
                                            commodo velit libero vitae neque. Integer at sapien quis nibh tempor
                                            ullamcorper.
                                        </Typography>
                                    </Box>
                                </Box>
                            ) : sectionIndex === 3 ? (
                                <Box
                                    sx={chapterContentSx}
                                >
                                    <Chapter
                                        chapterNumber="2"
                                        title="Titulo do capítulo"
                                        text={false}
                                        showText={false}
                                    />
                                    <Box
                                        sx={{
                                            mt: {xs: 2.5, md: 3},
                                            width: '100%',
                                            backgroundColor: 'background.defaultDark',
                                            borderRadius: {xs: '8px', md: '20px'},
                                            px: {xs: 2, sm: 3.5, md: 5},
                                            py: {xs: 3, sm: 3.5, md: 5},
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            gap: {xs: 2, md: 2.5},
                                            boxSizing: 'border-box',
                                        }}
                                    >
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                width: '100%',
                                                fontFamily: sansSerifFont,
                                                color: 'text.primary',
                                                fontSize: {xs: '15px', sm: '17px', md: '20px'},
                                                lineHeight: 1.6,
                                                textAlign: 'justify',
                                                letterSpacing: 0,
                                            }}
                                        >
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae
                                            justo sed nibh dignissim fermentum. Curabitur tempor, massa at facilisis viverra, tellus lorem posuere
                                            ligula, vitae efficitur justo arcu at erat.
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                width: '100%',
                                                fontFamily: sansSerifFont,
                                                color: 'text.primary',
                                                fontSize: {xs: '15px', sm: '17px', md: '20px'},
                                                lineHeight: 1.6,
                                                textAlign: 'justify',
                                                letterSpacing: 0,
                                            }}
                                        >
                                            Curabitur tempor, massa at facilisis viverra, tellus lorem posuere
                                            ligula, vitae efficitur justo arcu at erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae
                                            justo sed nibh dignissim fermentum.
                                        </Typography>
                                        <Box
                                            sx={{
                                                width: '100%',
                                                backgroundColor: 'background.paper',
                                                borderRadius: {xs: '8px', md: '20px'},
                                                px: {xs: 2.5, sm: 3, md: 3.5},
                                                py: {xs: 2.5, md: 3},
                                                textAlign: 'left',
                                                boxShadow: (theme) => `-6px 0 0 0 ${theme.palette.sustainable.main}`,
                                                boxSizing: 'border-box',
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                component="blockquote"
                                                sx={{
                                                    m: 0,
                                                    fontFamily: 'Georgia, "Times New Roman", serif',
                                                    color: 'text.primary',
                                                    fontWeight: 700,
                                                    fontSize: {xs: '17px', sm: '18px', md: '20px'},
                                                    lineHeight: 1.35,
                                                    letterSpacing: 0,
                                                }}
                                            >
                                                "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus diam urna tempor. "
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    mt: 1.5,
                                                    fontFamily: sansSerifFont,
                                                    color: 'text.secondary',
                                                    fontWeight: 300,
                                                    fontSize: {xs: '15px', sm: '17px', md: '20px'},
                                                    lineHeight: 1.4,
                                                    letterSpacing: 0,
                                                }}
                                            >
                                                - Chefe Fundador
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            ) : sectionIndex === 4 ? (
                                <Box
                                    sx={chapterContentSx}
                                >
                                    <Chapter
                                        chapterNumber="3"
                                        title="Titulo do capítulo"
                                        text="Texto do capítulo."
                                    />
                                </Box>
                            ) : sectionIndex === 5 ? (
                                <Box
                                    sx={{
                                        width: '100%',
                                        maxWidth: 1100,
                                        mx: 'auto',
                                        textAlign: 'center',
                                        color: '#FFFFFF',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 3.5,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            maxWidth: 720,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 1.5,
                                        }}
                                    >
                                        <Typography
                                            variant="h2"
                                            sx={{
                                                fontFamily: 'Georgia, "Times New Roman", serif',
                                                color: '#FFFFFF',
                                                fontWeight: 700,
                                                fontSize: {xs: '34px', md: '52px'},
                                                lineHeight: 1.1,
                                                letterSpacing: 0,
                                            }}
                                        >
                                            Nossos Valores
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontFamily: sansSerifFont,
                                                color: alpha('#FFFFFF', 0.82),
                                                fontSize: {xs: '16px', md: '20px'},
                                                lineHeight: 1.5,
                                                letterSpacing: 0,
                                            }}
                                        >
                                            Os princípios que guiam cada receita e cada escolha na cozinha
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            width: '100%',
                                            display: 'grid',
                                            gridTemplateColumns: {xs: '1fr', md: 'repeat(3, 1fr)'},
                                            gap: {xs: 3, md: 4},
                                            alignItems: 'start',
                                        }}
                                    >
                                        {valueColumns.map(({title, text, icon: ValueIcon}) => (
                                            <Box
                                                key={title}
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    textAlign: 'center',
                                                    gap: 1.5,
                                                    px: {xs: 1, md: 2},
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 78,
                                                        height: 78,
                                                        borderRadius: '50%',
                                                        backgroundColor: alpha('#FFFFFF', 0.14),
                                                        border: `1px solid ${alpha('#FFFFFF', 0.28)}`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <ValueIcon sx={{fontSize: 36, color: '#FFFFFF'}} />
                                                </Box>
                                                <Typography
                                                    variant="h6"
                                                    component="h3"
                                                    sx={{
                                                        fontFamily: sansSerifFont,
                                                        color: '#FFFFFF',
                                                        fontWeight: 700,
                                                        fontSize: {xs: '19px', md: '22px'},
                                                        lineHeight: 1.2,
                                                        letterSpacing: 0,
                                                    }}
                                                >
                                                    {title}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontFamily: sansSerifFont,
                                                        color: alpha('#FFFFFF', 0.78),
                                                        fontSize: {xs: '14px', md: '15px'},
                                                        lineHeight: 1.6,
                                                        maxWidth: 280,
                                                        letterSpacing: 0,
                                                    }}
                                                >
                                                    {text}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            ) : sectionIndex === 6 ? (
                                <Box
                                    sx={{
                                        backgroundColor: 'background.defaultDark',
                                        borderRadius: {xs: '8px', md: '20px'},
                                        mt: {xs: 2.5, md: 5},
                                        width: '100%',
                                        maxWidth: 680,
                                        mx: 'auto',
                                        px: {xs: 2.5, sm: 4, md: 5},
                                        py: {xs: 3.5, md: 5},
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: {xs: 2, md: 2.5},
                                    }}
                                >
                                    <Typography
                                        variant="h2"
                                        sx={{
                                            fontFamily: 'Georgia, "Times New Roman", serif',
                                            color: 'text.primary',
                                            fontWeight: 700,
                                            fontSize: {xs: '30px', sm: '36px', md: '48px'},
                                            lineHeight: 1.1,
                                            letterSpacing: 0,
                                        }}
                                    >
                                        Faça Parte Desta Jornada
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontFamily: sansSerifFont,
                                            color: 'text.primary',
                                            fontSize: {xs: '15px', sm: '17px', md: '20px'},
                                            lineHeight: 1.6,
                                            letterSpacing: 0,
                                        }}
                                    >
                                        Cada pessoa que adota a cozinha sustentavel contribui para um futuro melhor. Comece hoje mesmo explorando nossas receitas e descobrindo o potencial completo dos alimentos.
                                    </Typography>
                                    <Button
                                        component={RouterLink}
                                        to="/"
                                        variant="contained"
                                        sx={{
                                            mt: 1,
                                            width: {xs: '100%', sm: 'auto'},
                                            minWidth: {sm: 300},
                                            px: {xs: 2.5, sm: 8, md: 10},
                                            py: {xs: 1.1, md: 1.25},
                                            backgroundColor: (theme) => alpha(theme.palette.sustainable.main, 0.74),
                                            color: 'sustainable.contrastText',
                                            borderRadius: '45px',
                                            fontFamily: sansSerifFont,
                                            fontWeight: 500,
                                            fontSize: {xs: '16px', sm: '18px', md: '20px'},
                                            textTransform: 'none',
                                            boxShadow: 'none',
                                            '&:hover': {
                                                backgroundColor: 'sustainable.dark',
                                                boxShadow: 'none',
                                            },
                                        }}
                                    >
                                        Explorar Receitas
                                    </Button>
                                </Box>
                            ) : (
                                <Typography
                                    variant="h6"
                                    component="h2"
                                    sx={{
                                        fontFamily: sansSerifFont,
                                        color: 'text.primary',
                                        fontWeight: 600,
                                        fontSize: {xs: '18px', md: '20px'},
                                    }}
                                >
                                    {section.label}
                                </Typography>
                            )}
                        </Box>
                    );
                })}
            </Box>

            <Box
                sx={{
                    backgroundColor: 'background.paper',
                    display: 'flow-root',
                    width: '100%',
                }}
            >
                <Box
                    sx={{
                        maxWidth: 1100,
                        mx: 'auto',
                        px: {xs: 2, md: 3},
                    }}
                >
                    <Footer />
                </Box>
            </Box>
        </Box>
    );
};

export default EbookPage;
