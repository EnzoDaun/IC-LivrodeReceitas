import {createTheme} from '@mui/material/styles';

const theme = createTheme({
    palette: {
        background: {
            default: '#F6F0E6',
            paper: '#FAF7F3',
        },
        primary: {
            main: '#F05E46',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#FF8C42',
            contrastText: '#FFFFFF',
        },
        sustainable: {
            main: '#2D4B27',
            dark: '#243D20',
            contrastText: '#FFFFFF',
        },
        text: {
            primary: '#2D2D2D',
            secondary: '#6B6B6B',
        },
    },
    typography: {
        fontFamily: '"Poppins", "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        h1: {
            fontWeight: 800,
            letterSpacing: '-1.5px',
            lineHeight: 1.1,
            fontSize: '72px',
        },
        h6: {
            fontWeight: 700,
            fontSize: '18px',
            letterSpacing: '0.8px',
        },
        body1: {
            fontSize: '15px',
            fontWeight: 400,
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '13px',
            fontWeight: 400,
            lineHeight: 1.5,
        },
    },
    shape: {
        borderRadius: 20,
    },
    spacing: 8,
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    borderRadius: 24,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                },
            },
        },
    },
});

export default theme;

