import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
    Box, Button, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, Typography, ButtonBase, InputBase,
} from '@mui/material';
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
    const searchRef = useRef(null);
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
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
            window.alert(error.message || 'Nao foi possivel sair da conta.');
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
    };

    return (
        <>
            <Box sx={{ width: '100%', boxSizing: 'border-box', backgroundColor: 'transparent', pt: '6px', px: '1px' }}>
                <Box sx={{
                    width: '100%',
                    height: '47px',
                    border: '1px solid #BEB7AC',
                    borderRadius: '24px',
                    backgroundColor: 'background.default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: '16px',
                    boxSizing: 'border-box',
                }}>

                    {/* ── LOGO → home ── */}
                    <Box
                        component={RouterLink}
                        to="/"
                        sx={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            flexShrink: 0, minWidth: '120px', textDecoration: 'none',
                        }}
                    >
                        <Box component="img" src="/assets/icons/logo.png" alt="Livro de Receitas logo" sx={{ width: 36, height: 36, objectFit: 'contain' }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                            <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '13px', fontWeight: 700, color: '#2D2D2D', lineHeight: '14px' }}>
                                Livro de
                            </Typography>
                            <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '13px', fontWeight: 700, color: '#2D2D2D', lineHeight: '14px' }}>
                                receitas
                            </Typography>
                        </Box>
                    </Box>

                    {/* ── NAVEGAÇÃO ── */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '30px', flexGrow: 1, justifyContent: 'center' }}>
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
                        <Box ref={searchRef} sx={{ position: 'relative', flexShrink: 0 }}>
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
                </Box>
            </Box>

            {/* ── DIALOG CONFIRMAR LOGOUT ── */}
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
