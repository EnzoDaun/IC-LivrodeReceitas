import React from 'react';
import { ThemeProvider, CssBaseline, GlobalStyles, Box } from '@mui/material';
import theme from '@/config/theme/theme';
import AppRoutes from '@/config/routes/AppRoutes';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles styles={`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');`} />
            <CssBaseline />
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundColor: '#F6F0E6',
                }}
            >
                <AppRoutes />
            </Box>
        </ThemeProvider>
    );
}

export default App;
