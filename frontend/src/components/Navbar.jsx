import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
    Box, Button, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, Typography, ButtonBase, InputBase,
    Drawer, IconButton,
} from '@mui/material';
import {
    Close as CloseIcon,
    Menu as MenuIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { primaryNavigationLinks } from '@/config/navigation';
import { FONT_PRIMARY } from '@/config/constants/styles';
import { useAuth } from '@/hooks/useAuth';
import { VALIDATION_LIMITS, normalizeSpaces } from '@/utils/validation';
import { searchPublishedRecipes } from '@/services/supabase/recipeService';

const SearchIcon = () => (
    <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: 18, height: 18, flexShrink: 0 }}
        fill="none"
        stroke="#F06A57"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="10.5" cy="10.5" r="6.5" />
        <line x1="15.5" y1="15.5" x2="21" y2="21" />
    </Box>
);

const Navbar = ({ links, onSearch, initialActiveLink = 'Receitas', showSearch = true }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeLink, setActiveLink] = useState(initialActiveLink);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const desktopSearchRef = useRef(null);
    const mobileSearchRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, signOut } = useAuth();

    // ── busca ao vivo com debounce ────────────────────────────────────────
    useEffect(() => {
        const trimmed = normalizeSpaces(searchQuery);
        if (trimmed.length < 2) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        setIsSearching(true);
        setShowDropdown(true);

        const timer = setTimeout(async () => {
            try {
                const results = await searchPublishedRecipes(trimmed);
                setSearchResults(results);
            } catch {
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // ── fechar dropdown ao clicar fora ────────────────────────────────────
    useEffect(() => {
        const handleClickOutside = (e) => {
            const clickedInsideSearch = [desktopSearchRef.current, mobileSearchRef.current]
                .some((node) => node && node.contains(e.target));
            if (!clickedInsideSearch) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
        setShowDropdown(false);
    }, [location.pathname]);

    const navigationLinks = (links && links.length > 0) ? links : primaryNavigationLinks;

    const isLinkActive = (link) => {
        if (link.isLogout) return false;
        if (link.to) return location.pathname === link.to;
        return activeLink === link.label;
    };

    const confirmLogout = async () => {
        setLogoutDialogOpen(false);
        try {
            await signOut();
            navigate('/login', { replace: true });
        } catch (error) {
            window.alert(error.message || 'Não foi possível sair da conta.');
        }
    };

    const handleMaisVistasClick = (event) => {
        event.preventDefault();
        if (location.pathname === '/') {
            document.getElementById('mais-vistas')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/', { state: { scrollTo: 'mais-vistas' } });
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const normalizedSearchQuery = normalizeSpaces(searchQuery).slice(0, VALIDATION_LIMITS.searchMax);
        if (onSearch && normalizedSearchQuery) onSearch(normalizedSearchQuery);
        if (normalizedSearchQuery) {
            setShowDropdown(false);
            setMobileMenuOpen(false);
        }
    };

    const getDisplayedLink = (link) => {
        const isLogout = isAuthenticated && link.label === 'Login';
        return isLogout
            ? { ...link, label: 'Sair', to: undefined, href: undefined, scrollTo: undefined, isLogout: true }
            : link;
    };

    const getLinkProps = (displayedLink) => {
        if (displayedLink.isLogout || displayedLink.scrollTo) {
            return { component: 'button', type: 'button' };
        }

        if (displayedLink.to) {
            return { component: RouterLink, to: displayedLink.to };
        }

        if (displayedLink.href) {
            return { component: 'a', href: displayedLink.href };
        }

        return { component: 'button', type: 'button' };
    };

    const handleNavigationClick = (event, displayedLink, shouldCloseMobile = false) => {
        if (displayedLink.isLogout) {
            event.preventDefault();
            setMobileMenuOpen(false);
            setLogoutDialogOpen(true);
            return;
        }

        if (displayedLink.scrollTo) {
            handleMaisVistasClick(event);
            if (shouldCloseMobile) setMobileMenuOpen(false);
            return;
        }

        if (!displayedLink.to) setActiveLink(displayedLink.label);
        if (shouldCloseMobile) setMobileMenuOpen(false);
    };

    const renderNavigationLink = (link, variant = 'desktop') => {
        const displayedLink = getDisplayedLink(link);
        const active = isLinkActive(displayedLink);
        const linkProps = getLinkProps(displayedLink);
        const isMobile = variant === 'mobile';

        return (
            <ButtonBase
                key={link.label}
                {...linkProps}
                disableRipple
                onClick={(event) => handleNavigationClick(event, displayedLink, isMobile)}
                sx={isMobile ? {
                    width: '100%',
                    minHeight: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textDecoration: 'none',
                    py: '8px',
                    px: '2px',
                    borderBottom: '1px solid #EFE8DD',
                } : {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    textDecoration: 'none',
                    p: 0,
                }}
            >
                <Typography sx={{
                    fontFamily: FONT_PRIMARY,
                    fontSize: isMobile ? '13px' : '10px',
                    fontWeight: active ? 700 : 500,
                    color: active ? '#2A2622' : '#9A958D',
                    textTransform: 'uppercase',
                    lineHeight: isMobile ? '17px' : '12px',
                    letterSpacing: '0.2px',
                    whiteSpace: 'nowrap',
                }}>
                    {displayedLink.label}
                </Typography>
                {active && (
                    <Box sx={isMobile ? {
                        width: '7px',
                        height: '7px',
                        backgroundColor: '#F06A57',
                        borderRadius: '50%',
                        flexShrink: 0,
                    } : {
                        width: '100%',
                        height: '2px',
                        backgroundColor: '#F06A57',
                        borderRadius: '1px',
                    }}
                    />
                )}
            </ButtonBase>
        );
    };

    const renderSearchDropdown = (isMobile = false) => showDropdown && (
        <Box sx={{
            position: isMobile ? 'static' : 'absolute',
            top: isMobile ? 'auto' : 'calc(100% + 6px)',
            right: isMobile ? 'auto' : 0,
            width: isMobile ? '100%' : '300px',
            mt: isMobile ? '8px' : 0,
            backgroundColor: '#FFFFFF',
            borderRadius: isMobile ? '8px' : '12px',
            boxShadow: '0 8px 28px rgba(0,0,0,0.13)',
            border: '1px solid #E8E2DB',
            overflow: 'hidden',
            zIndex: 1300,
        }}>
            {isSearching && (
                <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '13px', color: '#9A958D', p: '14px' }}>
                    Buscando...
                </Typography>
            )}
            {!isSearching && searchResults.length === 0 && (
                <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '13px', color: '#9A958D', p: '14px' }}>
                    Nenhuma receita encontrada.
                </Typography>
            )}
            {!isSearching && searchResults.map((result, index) => (
                <Box
                    key={result.id}
                    onClick={() => {
                        navigate(`/receitas/${result.id}`);
                        setShowDropdown(false);
                        setSearchQuery('');
                        setMobileMenuOpen(false);
                    }}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        px: '12px',
                        py: '10px',
                        cursor: 'pointer',
                        borderBottom: index < searchResults.length - 1 ? '1px solid #F0EBE3' : 'none',
                        transition: 'background-color 0.15s',
                        '&:hover': { backgroundColor: '#FAF7F3' },
                    }}
                >
                    <Box
                        component="img"
                        src={result.imageUrl}
                        alt={result.title}
                        sx={{ width: 42, height: 42, borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <Typography sx={{
                        fontFamily: FONT_PRIMARY,
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#2D2D2D',
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                    }}>
                        {result.title}
                    </Typography>
                </Box>
            ))}
        </Box>
    );

    const renderSearchBox = (variant = 'desktop') => {
        const isMobile = variant === 'mobile';

        return (
            <Box ref={isMobile ? mobileSearchRef : desktopSearchRef} sx={{ position: 'relative', flexShrink: 0, width: isMobile ? '100%' : 'auto' }}>
                <Box
                    component="form"
                    onSubmit={handleSearchSubmit}
                    sx={{
                        width: isMobile ? '100%' : '190px',
                        height: isMobile ? '38px' : '28px',
                        border: '1px solid #F06A57',
                        borderRadius: '999px',
                        backgroundColor: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        pl: '14px',
                        pr: '10px',
                        boxSizing: 'border-box',
                    }}
                >
                    <InputBase
                        placeholder="Pesquisar receitas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value.slice(0, VALIDATION_LIMITS.searchMax))}
                        inputProps={{ 'aria-label': 'Pesquisar receitas', maxLength: VALIDATION_LIMITS.searchMax }}
                        sx={{
                            flex: 1,
                            fontFamily: FONT_PRIMARY,
                            fontSize: '12px',
                            fontWeight: 400,
                            fontStyle: 'italic',
                            color: '#F06A57',
                            '& input': {
                                p: 0,
                                fontFamily: FONT_PRIMARY,
                                fontSize: '12px',
                                fontStyle: 'italic',
                                color: '#F06A57',
                                '&::placeholder': { color: '#F06A57', opacity: 1 },
                            },
                        }}
                    />
                    <ButtonBase type="submit" disableRipple sx={{ p: 0, ml: '6px', display: 'flex', alignItems: 'center' }}>
                        <SearchIcon />
                    </ButtonBase>
                </Box>

                {renderSearchDropdown(isMobile)}
            </Box>
        );
    };

    return (
        <>
            <Box sx={{ width: '100%', boxSizing: 'border-box', backgroundColor: 'transparent', pt: '6px', px: '1px' }}>
                <Box sx={{
                    width: '100%',
                    height: { xs: '54px', md: '47px' },
                    border: '1px solid #BEB7AC',
                    borderRadius: { xs: '18px', md: '24px' },
                    backgroundColor: 'background.default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: { xs: '12px', md: '16px' },
                    boxSizing: 'border-box',
                }}>

                    {/* ── LOGO → home ── */}
                    <Box
                        component={RouterLink}
                        to="/"
                        sx={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            flexShrink: 0, minWidth: { xs: 'auto', md: '120px' }, textDecoration: 'none',
                        }}
                    >
                        <Box component="img" src="/assets/icons/logo.png" alt="Receitas Fantásticas logo" sx={{ width: 36, height: 36, objectFit: 'contain' }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                            <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '13px', fontWeight: 700, color: '#2D2D2D', lineHeight: '14px' }}>
                                Receitas
                            </Typography>
                            <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '13px', fontWeight: 700, color: '#2D2D2D', lineHeight: '14px' }}>
                                Fantásticas
                            </Typography>
                        </Box>
                    </Box>

                    {/* ── NAVEGAÇÃO ── */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: '30px', flexGrow: 1, justifyContent: 'center' }}>
                        {navigationLinks.map((link) => {
                            const isLogout = isAuthenticated && link.label === 'Login';
                            const displayedLink = isLogout
                                ? { ...link, label: 'Sair', to: undefined, href: undefined, scrollTo: undefined, isLogout: true }
                                : link;
                            const active = isLinkActive(displayedLink);

                            // resolve o componente e props do ButtonBase
                            let linkComponent = 'button';
                            let linkTo;
                            let linkHref;
                            if (!displayedLink.isLogout && !displayedLink.scrollTo) {
                                if (displayedLink.to) {
                                    linkComponent = RouterLink;
                                    linkTo = displayedLink.to;
                                } else if (displayedLink.href) {
                                    linkComponent = 'a';
                                    linkHref = displayedLink.href;
                                }
                            }

                            return (
                                <ButtonBase
                                    key={link.label}
                                    component={linkComponent}
                                    to={linkTo}
                                    href={linkHref}
                                    type="button"
                                    disableRipple
                                    onClick={(event) => {
                                        if (displayedLink.isLogout) {
                                            event.preventDefault();
                                            setLogoutDialogOpen(true);
                                            return;
                                        }
                                        if (displayedLink.scrollTo) {
                                            handleMaisVistasClick(event);
                                            return;
                                        }
                                        if (!displayedLink.to) setActiveLink(displayedLink.label);
                                    }}
                                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none', p: 0 }}
                                >
                                    <Typography sx={{
                                        fontFamily: FONT_PRIMARY,
                                        fontSize: '10px',
                                        fontWeight: active ? 600 : 500,
                                        color: active ? '#2A2622' : '#9A958D',
                                        textTransform: 'uppercase',
                                        lineHeight: '12px',
                                        letterSpacing: '0.2px',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {displayedLink.label}
                                    </Typography>
                                    {active && <Box sx={{ width: '100%', height: '2px', backgroundColor: '#F06A57', borderRadius: '1px' }} />}
                                </ButtonBase>
                            );
                        })}
                    </Box>

                    {/* ── BUSCA ── */}
                    {showSearch && (
                        <Box ref={desktopSearchRef} sx={{ position: 'relative', flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
                            <Box
                                component="form"
                                onSubmit={handleSearchSubmit}
                                sx={{
                                    width: '190px', height: '28px',
                                    border: '1px solid #F06A57', borderRadius: '999px',
                                    backgroundColor: 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    pl: '14px', pr: '10px', boxSizing: 'border-box',
                                }}
                            >
                                <InputBase
                                    placeholder="Pesquisar receitas..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value.slice(0, VALIDATION_LIMITS.searchMax))}
                                    inputProps={{ 'aria-label': 'Pesquisar receitas', maxLength: VALIDATION_LIMITS.searchMax }}
                                    sx={{
                                        flex: 1, fontFamily: FONT_PRIMARY, fontSize: '12px', fontWeight: 400, fontStyle: 'italic', color: '#F06A57',
                                        '& input': {
                                            p: 0, fontFamily: FONT_PRIMARY, fontSize: '12px', fontStyle: 'italic', color: '#F06A57',
                                            '&::placeholder': { color: '#F06A57', opacity: 1 },
                                        },
                                    }}
                                />
                                <ButtonBase type="submit" disableRipple sx={{ p: 0, ml: '6px', display: 'flex', alignItems: 'center' }}>
                                    <SearchIcon />
                                </ButtonBase>
                            </Box>

                            {/* ── DROPDOWN DE RESULTADOS ── */}
                            {showDropdown && (
                                <Box sx={{
                                    position: 'absolute',
                                    top: 'calc(100% + 6px)',
                                    right: 0,
                                    width: '300px',
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '12px',
                                    boxShadow: '0 8px 28px rgba(0,0,0,0.13)',
                                    border: '1px solid #E8E2DB',
                                    overflow: 'hidden',
                                    zIndex: 1300,
                                }}>
                                    {isSearching && (
                                        <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '13px', color: '#9A958D', p: '14px' }}>
                                            Buscando...
                                        </Typography>
                                    )}
                                    {!isSearching && searchResults.length === 0 && (
                                        <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '13px', color: '#9A958D', p: '14px' }}>
                                            Nenhuma receita encontrada.
                                        </Typography>
                                    )}
                                    {!isSearching && searchResults.map((result, index) => (
                                        <Box
                                            key={result.id}
                                            onClick={() => {
                                                navigate(`/receitas/${result.id}`);
                                                setShowDropdown(false);
                                                setSearchQuery('');
                                            }}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                px: '12px',
                                                py: '10px',
                                                cursor: 'pointer',
                                                borderBottom: index < searchResults.length - 1 ? '1px solid #F0EBE3' : 'none',
                                                transition: 'background-color 0.15s',
                                                '&:hover': { backgroundColor: '#FAF7F3' },
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={result.imageUrl}
                                                alt={result.title}
                                                sx={{ width: 42, height: 42, borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                                            />
                                            <Typography sx={{
                                                fontFamily: FONT_PRIMARY,
                                                fontSize: '13px',
                                                fontWeight: 600,
                                                color: '#2D2D2D',
                                                lineHeight: 1.3,
                                                overflow: 'hidden',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                            }}>
                                                {result.title}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    )}

                    <IconButton
                        type="button"
                        aria-label="Abrir menu"
                        onClick={() => setMobileMenuOpen(true)}
                        sx={{
                            display: { xs: 'inline-flex', md: 'none' },
                            width: 38,
                            height: 38,
                            color: '#2D2D2D',
                            border: '1px solid #E4DDD4',
                        }}
                    >
                        <MenuIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            {/* ── DIALOG CONFIRMAR LOGOUT ── */}
            <Drawer
                anchor="right"
                open={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                slotProps={{
                    paper: {
                        sx: {
                            width: { xs: 'min(86vw, 340px)', sm: 360 },
                            backgroundColor: '#FFFBF2',
                            p: '18px',
                            boxSizing: 'border-box',
                        },
                    },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <Box
                        component={RouterLink}
                        to="/"
                        onClick={() => setMobileMenuOpen(false)}
                        sx={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', minWidth: 0 }}
                    >
                        <Box component="img" src="/assets/icons/logo.png" alt="Receitas Fantásticas logo" sx={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1, minWidth: 0 }}>
                            <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '13px', fontWeight: 700, color: '#2D2D2D', lineHeight: '14px' }}>
                                Receitas
                            </Typography>
                            <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '13px', fontWeight: 700, color: '#2D2D2D', lineHeight: '14px' }}>
                                Fantásticas
                            </Typography>
                        </Box>
                    </Box>

                    <IconButton
                        type="button"
                        aria-label="Fechar menu"
                        onClick={() => setMobileMenuOpen(false)}
                        sx={{ width: 36, height: 36, color: '#2D2D2D' }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                {showSearch && (
                    <Box sx={{ mt: '18px' }}>
                        {renderSearchBox('mobile')}
                    </Box>
                )}

                <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', mt: '18px' }}>
                    {navigationLinks.map((link) => renderNavigationLink(link, 'mobile'))}
                </Box>
            </Drawer>

            <Dialog
                open={logoutDialogOpen}
                onClose={() => setLogoutDialogOpen(false)}
                maxWidth="xs"
                fullWidth
                slotProps={{ paper: { sx: { borderRadius: '16px', px: 1 } } }}
            >
                <DialogTitle sx={{ fontFamily: FONT_PRIMARY, fontWeight: 700, fontSize: '18px', pb: 1 }}>
                    Sair da conta
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontFamily: FONT_PRIMARY, fontSize: '14px', color: '#667085' }}>
                        Deseja mesmo sair?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button
                        onClick={() => setLogoutDialogOpen(false)}
                        variant="outlined"
                        sx={{ borderRadius: '8px', textTransform: 'none', fontFamily: FONT_PRIMARY, fontWeight: 500, borderColor: '#CEC7BA', color: '#667085', '&:hover': { borderColor: '#667085', backgroundColor: 'transparent' } }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={confirmLogout}
                        variant="contained"
                        sx={{ borderRadius: '8px', textTransform: 'none', fontFamily: FONT_PRIMARY, fontWeight: 600, backgroundColor: '#F06A57', boxShadow: 'none', '&:hover': { backgroundColor: '#d9533e', boxShadow: 'none' } }}
                    >
                        Sair
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

Navbar.propTypes = {
    links: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            to: PropTypes.string,
            href: PropTypes.string,
            scrollTo: PropTypes.string,
        })
    ),
    onSearch: PropTypes.func,
    initialActiveLink: PropTypes.string,
    showSearch: PropTypes.bool,
};

export default Navbar;
