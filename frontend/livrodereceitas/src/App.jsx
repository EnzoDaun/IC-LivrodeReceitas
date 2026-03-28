import React from 'react';
import {ThemeProvider, CssBaseline, Box} from '@mui/material';
import theme from './theme/theme';
import AppRoutes from './routes/AppRoutes';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundColor: '#F6F0E6',
                }}
            >
                <AppRoutes/>
            </Box>
        </ThemeProvider>
    );
}

export default App;
