import React, {useState} from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    InputBase,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from '@mui/material';
import {
    Search as SearchIcon,
    Menu as MenuIcon,
    Close as CloseIcon,
    MenuBook as MenuBookIcon,
} from '@mui/icons-material';

const Navbar = ({links = [], onSearch}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('Receitas');

    const defaultLinks = [
        {label: 'Receitas', href: '#receitas'},
        {label: 'Mais vistas', href: '#mais-vistas'},
        {label: 'Favoritas', href: '#favoritas'},
        {label: 'Login', href: '#login'},
        {label: 'Sobre nós', href: '#sobre'},
    ];

    const navigationLinks = links.length > 0 ? links : defaultLinks;

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (onSearch && searchQuery.trim()) {
            onSearch(searchQuery);
        }
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box sx={{width: 250, pt: 2}}>
            <Box sx={{display: 'flex', justifyContent: 'flex-end', px: 2, pb: 2}}>
                <IconButton onClick={handleDrawerToggle} aria-label="Fechar menu">
                    <CloseIcon/>
                </IconButton>
            </Box>
            <List>
                {navigationLinks.map((link) => (
                    <ListItem key={link.label} disablePadding>
                        <ListItemButton
                            component="a"
                            href={link.href}
                            onClick={() => {
                                setActiveLink(link.label);
                                handleDrawerToggle();
                            }}
                        >
                            <ListItemText primary={link.label}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <AppBar position="static" elevation={0} color="transparent" role="navigation">
            <Toolbar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 3,
                    py: 1.5,
                    minHeight: '56px !important',
                    backgroundColor: 'transparent',
                    border: '1.5px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: '16px',
                }}
            >
                {/* Logo - Left */}
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1.2, flexShrink: 0}}>
                    <MenuBookIcon sx={{fontSize: 20, color: '#6B6B6B', strokeWidth: 0.5}}/>
                    <Typography
                        variant="body2"
                        component="div"
                        sx={{
                            fontWeight: 500,
                            fontSize: '13px',
                            color: '#2D2D2D',
                            lineHeight: 1.25,
                            display: {xs: 'none', sm: 'block'},
                            maxWidth: '85px',
                        }}
                    >
                        Livro de receitas
                    </Typography>
                </Box>

                {/* Nav Links - Center */}
                <Box
                    sx={{
                        display: {xs: 'none', md: 'flex'},
                        gap: 3.5,
                        alignItems: 'center',
                        flexGrow: 1,
                        justifyContent: 'center',
                    }}
                >
                    {navigationLinks.map((link) => (
                        <Typography
                            key={link.label}
                            component="a"
                            href={link.href}
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveLink(link.label);
                            }}
                            sx={{
                                fontWeight: 500,
                                color: activeLink === link.label ? '#2D2D2D' : '#6B6B6B',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                fontSize: '13px',
                                paddingBottom: '6px',
                                borderBottom: activeLink === link.label ? '2px solid #F05E46' : '2px solid transparent',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    color: '#2D2D2D',
                                },
                            }}
                        >
                            {link.label}
                        </Typography>
                    ))}
                </Box>

                {/* Search */}
                <Box
                    component="form"
                    onSubmit={handleSearchSubmit}
                    sx={{
                        display: {xs: 'none', md: 'flex'},
                        alignItems: 'center',
                        height: 36,
                        px: 2,
                        borderRadius: '18px',
                        border: '1.5px solid #F05E46',
                        backgroundColor: 'transparent',
                        width: 200,
                        flexShrink: 0,
                    }}
                >
                    <InputBase
                        sx={{
                            flex: 1,
                            fontSize: '12.5px',
                            color: '#F05E46',
                            '&::placeholder': {
                                color: '#F05E46',
                                opacity: 0.7,
                            }
                        }}
                        placeholder="Pesquisar receitas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        inputProps={{'aria-label': 'Pesquisar receitas'}}
                    />
                    <IconButton
                        type="submit"
                        size="small"
                        sx={{ml: 0.5, p: 0.5, color: '#F05E46'}}
                        aria-label="Pesquisar"
                    >
                        <SearchIcon sx={{fontSize: 16}}/>
                    </IconButton>
                </Box>

                {/* Menu Mobile */}
                <IconButton
                    color="inherit"
                    aria-label="Abrir menu"
                    aria-expanded={mobileOpen}
                    onClick={handleDrawerToggle}
                    sx={{color: 'text.primary', display: {xs: 'flex', md: 'none'}}}
                >
                    <MenuIcon/>
                </IconButton>
            </Toolbar>

            {/* Drawer Mobile */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                {drawer}
            </Drawer>
        </AppBar>
    );
};

export default Navbar;


