import PropTypes from 'prop-types';
import React from 'react';
import {
    Box,
    Button,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
} from '@mui/material';
import {
    FilterAltOff as FilterAltOffIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import { COLOR_ORANGE, FONT_PRIMARY } from '@/config/constants/styles';
import { VALIDATION_LIMITS } from '@/utils/validation';
import {
    ALL_CATEGORIES,
    ALL_DIFFICULTIES,
    FILTER_MENU_PROPS,
    filterControlSx,
} from '@/components/Recipes/recipeListControlOptions';

const surfaceSx = {
    public: {
        border: '1px solid #CEC7BA',
        borderRadius: '8px',
        backgroundColor: '#FFFBF2',
        p: { xs: '16px', md: '18px' },
        mb: '22px',
    },
    admin: {
        mt: '22px',
        borderRadius: '9px',
        boxShadow: '0px 3px 13px rgba(0,0,0,0.08)',
        backgroundColor: '#FEFEFD',
        p: { xs: '16px', md: '18px' },
    },
};

const controlFlex = {
    public: {
        search: { xs: '1 1 auto', md: '2 1 260px' },
        category: { xs: '1 1 auto', md: '1 1 180px' },
        difficulty: { xs: '1 1 auto', md: '1 1 160px' },
        status: { xs: '1 1 auto', md: '1 1 150px' },
        sort: { xs: '1 1 auto', md: '1 1 160px' },
    },
    admin: {
        search: { xs: '1 1 auto', md: '2 1 240px' },
        category: { xs: '1 1 auto', md: '1 1 160px' },
        difficulty: { xs: '1 1 auto', md: '1 1 150px' },
        status: { xs: '1 1 auto', md: '1 1 140px' },
        sort: { xs: '1 1 auto', md: '1 1 150px' },
    },
};

function RecipeFilterControls({
    categories = [],
    difficultyOptions = [],
    filters,
    hasActiveFilters,
    idPrefix,
    onClear,
    onFilterChange,
    sortOptions,
    statusOptions = [],
    variant = 'public',
}) {
    const showStatus = statusOptions.length > 0;
    const flex = controlFlex[variant];
    const content = (
        <Box sx={{
            display: 'flex',
            alignItems: { xs: 'stretch', md: 'center' },
            gap: '12px',
            flexDirection: { xs: 'column', md: 'row' },
            flexWrap: 'wrap',
        }}>
            <TextField
                label="Buscar"
                value={filters.search}
                onChange={(event) => onFilterChange('search', event.target.value.slice(0, VALIDATION_LIMITS.searchMax))}
                placeholder="Nome, descricao ou categoria"
                size="small"
                inputProps={{ maxLength: VALIDATION_LIMITS.searchMax }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: COLOR_ORANGE, fontSize: 18 }} />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    ...filterControlSx,
                    flex: flex.search,
                }}
            />

            <FormControl
                size="small"
                sx={{
                    ...filterControlSx,
                    flex: flex.category,
                    minWidth: { xs: '100%', md: variant === 'admin' ? 160 : 180 },
                }}
            >
                <InputLabel id={`${idPrefix}-category-filter-label`}>Categoria</InputLabel>
                <Select
                    labelId={`${idPrefix}-category-filter-label`}
                    label="Categoria"
                    value={filters.category}
                    onChange={(event) => onFilterChange('category', event.target.value)}
                    MenuProps={FILTER_MENU_PROPS}
                >
                    <MenuItem value={ALL_CATEGORIES}>Todas</MenuItem>
                    {categories.map((category) => (
                        <MenuItem key={category.id} value={category.name}>
                            {category.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl
                size="small"
                sx={{
                    ...filterControlSx,
                    flex: flex.difficulty,
                    minWidth: { xs: '100%', md: variant === 'admin' ? 150 : 160 },
                }}
            >
                <InputLabel id={`${idPrefix}-difficulty-filter-label`}>Dificuldade</InputLabel>
                <Select
                    labelId={`${idPrefix}-difficulty-filter-label`}
                    label="Dificuldade"
                    value={filters.difficulty}
                    onChange={(event) => onFilterChange('difficulty', event.target.value)}
                    MenuProps={FILTER_MENU_PROPS}
                >
                    <MenuItem value={ALL_DIFFICULTIES}>Todas</MenuItem>
                    {difficultyOptions.map((difficulty) => (
                        <MenuItem key={difficulty} value={difficulty}>
                            {difficulty}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {showStatus && (
                <FormControl
                    size="small"
                    sx={{
                        ...filterControlSx,
                        flex: flex.status,
                        minWidth: { xs: '100%', md: 140 },
                    }}
                >
                    <InputLabel id={`${idPrefix}-status-filter-label`}>Status</InputLabel>
                    <Select
                        labelId={`${idPrefix}-status-filter-label`}
                        label="Status"
                        value={filters.status}
                        onChange={(event) => onFilterChange('status', event.target.value)}
                        MenuProps={FILTER_MENU_PROPS}
                    >
                        {statusOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            <FormControl
                size="small"
                sx={{
                    ...filterControlSx,
                    flex: flex.sort,
                    minWidth: { xs: '100%', md: variant === 'admin' ? 150 : 160 },
                }}
            >
                <InputLabel id={`${idPrefix}-sort-filter-label`}>Ordenar</InputLabel>
                <Select
                    labelId={`${idPrefix}-sort-filter-label`}
                    label="Ordenar"
                    value={filters.sort}
                    onChange={(event) => onFilterChange('sort', event.target.value)}
                    MenuProps={FILTER_MENU_PROPS}
                >
                    {sortOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button
                type="button"
                variant="outlined"
                startIcon={<FilterAltOffIcon sx={{ fontSize: 18 }} />}
                onClick={onClear}
                disabled={!hasActiveFilters}
                sx={{
                    height: '40px',
                    borderRadius: '8px',
                    borderColor: '#2D2D2D',
                    color: '#2D2D2D',
                    fontFamily: FONT_PRIMARY,
                    fontSize: '12px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    px: '14px',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                        borderColor: '#2D2D2D',
                        backgroundColor: 'rgba(45,45,45,0.05)',
                    },
                }}
            >
                Limpar
            </Button>
        </Box>
    );

    if (variant === 'admin') {
        return (
            <Paper elevation={0} sx={surfaceSx.admin}>
                {content}
            </Paper>
        );
    }

    return (
        <Box sx={surfaceSx.public}>
            {content}
        </Box>
    );
}

const optionShape = PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
});

RecipeFilterControls.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    })),
    difficultyOptions: PropTypes.arrayOf(PropTypes.string),
    filters: PropTypes.shape({
        search: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        difficulty: PropTypes.string.isRequired,
        status: PropTypes.string,
        sort: PropTypes.string.isRequired,
    }).isRequired,
    hasActiveFilters: PropTypes.bool.isRequired,
    idPrefix: PropTypes.string.isRequired,
    onClear: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    sortOptions: PropTypes.arrayOf(optionShape).isRequired,
    statusOptions: PropTypes.arrayOf(optionShape),
    variant: PropTypes.oneOf(['public', 'admin']),
};

export default RecipeFilterControls;
