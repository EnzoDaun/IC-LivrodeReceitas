import PropTypes from 'prop-types';
import React from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { COLOR_ORANGE, FONT_PRIMARY } from '@/config/constants/styles';
import {
    FILTER_MENU_PROPS,
    PAGE_SIZE_OPTIONS,
    filterControlSx,
} from '@/components/Recipes/recipeListControlOptions';

function RecipePaginationControls({
    displayedEnd,
    displayedStart,
    idPrefix,
    onPageChange,
    onPageSizeChange,
    page,
    pageSize,
    pageSizeOptions = PAGE_SIZE_OPTIONS,
    totalItems,
    totalPages,
    bottomSpacing = '70px',
}) {
    const theme = useTheme();
    const isCompact = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr auto' },
            alignItems: 'center',
            gap: { xs: '12px', sm: '14px' },
            mt: '24px',
            pt: '16px',
            borderTop: '1px solid #E8E1D8',
            mb: bottomSpacing,
        }}>
            <Typography sx={{
                fontFamily: FONT_PRIMARY,
                fontSize: '12px',
                color: '#6B6B6B',
                textAlign: { xs: 'center', sm: 'left' },
                whiteSpace: 'nowrap',
            }}>
                {`Mostrando ${displayedStart}-${displayedEnd} de ${totalItems}`}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', minWidth: 0 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, nextPage) => onPageChange(nextPage)}
                    siblingCount={isCompact ? 0 : 1}
                    boundaryCount={1}
                    size={isCompact ? 'small' : 'medium'}
                    showFirstButton={!isCompact}
                    showLastButton={!isCompact}
                    sx={{
                        '& .MuiPagination-ul': {
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            gap: { xs: '2px', sm: '4px' },
                        },
                        '& .MuiPaginationItem-root': {
                            fontFamily: FONT_PRIMARY,
                            m: { xs: '1px', sm: '2px' },
                        },
                        '& .Mui-selected': {
                            backgroundColor: `${COLOR_ORANGE} !important`,
                            color: '#FFFFFF',
                        },
                    }}
                />
            </Box>

            <FormControl
                size="small"
                sx={{
                    ...filterControlSx,
                    width: { xs: '100%', sm: 150 },
                    maxWidth: { xs: 220, sm: 150 },
                    mx: { xs: 'auto', sm: 0 },
                }}
            >
                <InputLabel id={`${idPrefix}-page-size-label`}>Por página</InputLabel>
                <Select
                    labelId={`${idPrefix}-page-size-label`}
                    label="Por página"
                    value={pageSize}
                    onChange={(event) => onPageSizeChange(Number(event.target.value))}
                    MenuProps={FILTER_MENU_PROPS}
                >
                    {pageSizeOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}

RecipePaginationControls.propTypes = {
    displayedEnd: PropTypes.number.isRequired,
    displayedStart: PropTypes.number.isRequired,
    idPrefix: PropTypes.string.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onPageSizeChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
    totalItems: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    bottomSpacing: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default RecipePaginationControls;
