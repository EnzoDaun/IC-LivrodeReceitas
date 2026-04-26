import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, ButtonBase, InputBase } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { primaryNavigationLinks } from '@/config/navigation';
import { FONT_PRIMARY } from '@/config/constants/styles';



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
    const [activeLink, setActiveLink] = useState(initialActiveLink);
    const location = useLocation();

    const navigationLinks = (links && links.length > 0) ? links : primaryNavigationLinks;

    const isLinkActive = (link) => {
        if (link.to) return location.pathname === link.to;
        return activeLink === link.label;
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (onSearch && searchQuery.trim()) onSearch(searchQuery);
    };

    return (
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

                {/* ── LOGO ── */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, minWidth: '120px' }}>
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
                        const active = isLinkActive(link);
                        return (
                            <ButtonBase
                                key={link.label}
                                component={link.to ? RouterLink : 'a'}
                                to={link.to}
                                href={link.href}
                                disableRipple
                                onClick={() => { if (!link.to) setActiveLink(link.label); }}
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
                                    {link.label}
                                </Typography>
                                {active && <Box sx={{ width: '100%', height: '2px', backgroundColor: '#F06A57', borderRadius: '1px' }} />}
                            </ButtonBase>
                        );
                    })}
                </Box>

                {/* ── BUSCA ── */}
                {showSearch && (
                    <Box
                        component="form"
                        onSubmit={handleSearchSubmit}
                        sx={{
                            width: '190px', height: '28px',
                            border: '1px solid #F06A57', borderRadius: '999px',
                            backgroundColor: 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            pl: '14px', pr: '10px', boxSizing: 'border-box', flexShrink: 0,
                        }}
                    >
                        <InputBase
                            placeholder="Pesquisar receitas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            inputProps={{ 'aria-label': 'Pesquisar receitas' }}
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
                )}
            </Box>
        </Box>
    );
};


Navbar.propTypes = {
    links: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            to: PropTypes.string,
            href: PropTypes.string,
        })
    ),
    onSearch: PropTypes.func,
    initialActiveLink: PropTypes.string,
    showSearch: PropTypes.bool,
};

export default Navbar;
