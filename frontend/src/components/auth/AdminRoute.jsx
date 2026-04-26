import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';

const AdminRoute = ({ children }) => {
    const { isAdmin, isLoading, profile } = useAuth();

    if (isLoading || !profile) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
                <CircularProgress sx={{ color: '#F29F05' }} />
            </Box>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/receitas" replace />;
    }

    return children;
};

AdminRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AdminRoute;
