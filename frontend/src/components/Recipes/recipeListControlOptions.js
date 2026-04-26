import { COLOR_ORANGE, FONT_PRIMARY } from '@/config/constants/styles';

export const ALL_CATEGORIES = 'all';
export const ALL_DIFFICULTIES = 'all';
export const ALL_STATUSES = 'all';

export const PAGE_SIZE_OPTIONS = [6, 8, 10, 12];

export const DEFAULT_RECIPE_FILTERS = {
    search: '',
    category: ALL_CATEGORIES,
    difficulty: ALL_DIFFICULTIES,
    sort: 'recent',
};

export const DEFAULT_ADMIN_RECIPE_FILTERS = {
    ...DEFAULT_RECIPE_FILTERS,
    status: ALL_STATUSES,
};

export const DIFFICULTY_OPTIONS = ['Fácil', 'Médio', 'Difícil'];

export const RECIPE_SORT_OPTIONS = [
    { value: 'recent', label: 'Mais recentes' },
    { value: 'rating', label: 'Melhor avaliadas' },
    { value: 'prepTime', label: 'Menor tempo' },
    { value: 'title', label: 'A-Z' },
];

export const ADMIN_STATUS_OPTIONS = [
    { value: ALL_STATUSES, label: 'Todos' },
    { value: 'published', label: 'Publicadas' },
    { value: 'draft', label: 'Rascunhos' },
];

export const FILTER_MENU_PROPS = {
    PaperProps: {
        sx: {
            maxHeight: 280,
        },
    },
};

export const filterControlSx = {
    '& .MuiInputLabel-root': {
        fontFamily: FONT_PRIMARY,
        fontSize: '13px',
        color: '#6B6B6B',
        '&.Mui-focused': {
            color: COLOR_ORANGE,
        },
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: '#FFFDF8',
        fontFamily: FONT_PRIMARY,
        fontSize: '13px',
        color: '#2D2D2D',
        '& fieldset': {
            borderColor: '#CEC7BA',
        },
        '&:hover fieldset': {
            borderColor: '#AFA696',
        },
        '&.Mui-focused fieldset': {
            borderColor: COLOR_ORANGE,
        },
    },
};
