import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const {
        configError,
        isAuthenticated,
        isLoading,
    } = useAuth();

    if (isLoading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
                <CircularProgress sx={{ color: '#F29F05' }} />
            </Box>
        );
    }

    if (configError) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', px: 3 }}>
                <Typography sx={{ maxWidth: 520, textAlign: 'center', color: '#2D2D2D' }}>
                    {configError}
                </Typography>
            </Box>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
