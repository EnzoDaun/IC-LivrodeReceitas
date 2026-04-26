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
} from '@mui/material';
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
    return (
        <Box sx={{
            display: 'flex',
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            gap: '14px',
            flexDirection: { xs: 'column', sm: 'row' },
            mt: '22px',
            mb: bottomSpacing,
        }}>
            <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '12px', color: '#6B6B6B' }}>
                {`Mostrando ${displayedStart}-${displayedEnd} de ${totalItems}`}
            </Typography>

            <Pagination
                count={totalPages}
                page={page}
                onChange={(_, nextPage) => onPageChange(nextPage)}
                siblingCount={1}
                boundaryCount={1}
                sx={{
                    alignSelf: { xs: 'center', sm: 'auto' },
                    '& .MuiPaginationItem-root': {
                        fontFamily: FONT_PRIMARY,
                    },
                    '& .Mui-selected': {
                        backgroundColor: `${COLOR_ORANGE} !important`,
                        color: '#FFFFFF',
                    },
                }}
            />

            <FormControl size="small" sx={{ ...filterControlSx, minWidth: { xs: '100%', sm: 150 } }}>
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
