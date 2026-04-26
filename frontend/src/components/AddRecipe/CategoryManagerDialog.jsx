import React, { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { FONT_PRIMARY, COLOR_ORANGE } from '@/config/constants/styles';
import {
    createRecipeCategory,
    deleteRecipeCategory,
    updateRecipeCategory,
} from '@/services/supabase/recipeService';
import {
    VALIDATION_LIMITS,
    normalizeSpaces,
    validateCategoryName,
} from '@/utils/validation';

const dialogInputSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '6px',
        backgroundColor: '#FFFFFF',
        '& fieldset': {
            borderColor: '#8FA0B7',
            borderWidth: '1px',
        },
        '&:hover fieldset': { borderColor: '#8FA0B7' },
        '&.Mui-focused fieldset': { borderColor: '#8FA0B7', borderWidth: '1px' },
    },
    '& .MuiOutlinedInput-input': {
        fontFamily: FONT_PRIMARY,
        fontSize: '14px',
    },
};

function sortCategories(categories) {
    return [...categories].sort((firstCategory, secondCategory) => (
        firstCategory.name.localeCompare(secondCategory.name, 'pt-BR')
    ));
}

function mergeCategory(categories, category) {
    const nextCategories = categories.some((currentCategory) => currentCategory.id === category.id)
        ? categories.map((currentCategory) => (
            currentCategory.id === category.id ? category : currentCategory
        ))
        : [...categories, category];

    return sortCategories(nextCategories);
}

function hasCategoryName(categories, name, ignoredCategoryId = null) {
    const normalizedName = normalizeSpaces(name).toLocaleLowerCase('pt-BR');

    return categories.some((category) => (
        category.id !== ignoredCategoryId
        && normalizeSpaces(category.name).toLocaleLowerCase('pt-BR') === normalizedName
    ));
}

const CategoryManagerDialog = ({
    open,
    categories,
    selectedCategory,
    onClose,
    onCategoriesChange,
    onSelectCategory,
}) => {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');
    const [deleteCandidate, setDeleteCandidate] = useState(null);
    const [busyAction, setBusyAction] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [newCategoryError, setNewCategoryError] = useState('');
    const [editingCategoryError, setEditingCategoryError] = useState('');

    useEffect(() => {
        if (!open) {
            setNewCategoryName('');
            setEditingCategoryId(null);
            setEditingCategoryName('');
            setDeleteCandidate(null);
            setBusyAction('');
            setNewCategoryError('');
            setEditingCategoryError('');
        }

        setErrorMessage('');
        setSuccessMessage('');
    }, [open]);

    const handleCreateCategory = async () => {
        const categoryName = normalizeSpaces(newCategoryName);
        const categoryError = validateCategoryName(categoryName);
        setErrorMessage('');
        setSuccessMessage('');
        setNewCategoryError('');

        if (categoryError) {
            setNewCategoryError(categoryError);
            setErrorMessage(categoryError);
            return;
        }

        if (hasCategoryName(categories, categoryName)) {
            const duplicateMessage = 'Essa categoria ja existe.';
            setNewCategoryError(duplicateMessage);
            setErrorMessage(duplicateMessage);
            return;
        }

        try {
            setBusyAction('create');
            const createdCategory = await createRecipeCategory(categoryName);
            onCategoriesChange(mergeCategory(categories, createdCategory));
            onSelectCategory(createdCategory.name);
            setNewCategoryName('');
            setSuccessMessage('Categoria criada.');
        } catch (error) {
            setErrorMessage(error.message || 'Nao foi possivel criar a categoria.');
        } finally {
            setBusyAction('');
        }
    };

    const handleStartEdit = (category) => {
        setEditingCategoryId(category.id);
        setEditingCategoryName(category.name);
        setDeleteCandidate(null);
        setErrorMessage('');
        setSuccessMessage('');
        setEditingCategoryError('');
    };

    const handleSaveEdit = async (category) => {
        const categoryName = normalizeSpaces(editingCategoryName);
        const categoryError = validateCategoryName(categoryName);
        setErrorMessage('');
        setSuccessMessage('');
        setEditingCategoryError('');

        if (categoryError) {
            setEditingCategoryError(categoryError);
            setErrorMessage(categoryError);
            return;
        }

        if (hasCategoryName(categories, categoryName, category.id)) {
            const duplicateMessage = 'Essa categoria ja existe.';
            setEditingCategoryError(duplicateMessage);
            setErrorMessage(duplicateMessage);
            return;
        }

        if (categoryName === category.name) {
            setEditingCategoryId(null);
            setEditingCategoryName('');
            setEditingCategoryError('');
            return;
        }

        try {
            setBusyAction(`edit-${category.id}`);
            const updatedCategory = await updateRecipeCategory({
                categoryId: category.id,
                name: categoryName,
            });
            onCategoriesChange(mergeCategory(categories, updatedCategory));

            if (selectedCategory === category.name) {
                onSelectCategory(updatedCategory.name);
            }

            setEditingCategoryId(null);
            setEditingCategoryName('');
            setEditingCategoryError('');
            setSuccessMessage('Categoria atualizada.');
        } catch (error) {
            setErrorMessage(error.message || 'Nao foi possivel atualizar a categoria.');
        } finally {
            setBusyAction('');
        }
    };

    const handleDeleteCategory = async (category) => {
        setErrorMessage('');
        setSuccessMessage('');

        try {
            setBusyAction(`delete-${category.id}`);
            await deleteRecipeCategory({
                categoryId: category.id,
                name: category.name,
            });

            onCategoriesChange(categories.filter((currentCategory) => currentCategory.id !== category.id));

            if (selectedCategory === category.name) {
                onSelectCategory('');
            }

            setDeleteCandidate(null);
            setEditingCategoryId(null);
            setEditingCategoryName('');
            setEditingCategoryError('');
            setSuccessMessage('Categoria excluida.');
        } catch (error) {
            setErrorMessage(error.message || 'Nao foi possivel excluir a categoria.');
        } finally {
            setBusyAction('');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontFamily: FONT_PRIMARY, fontWeight: 800, pb: 1 }}>
                Gerenciar categorias
            </DialogTitle>
            <DialogContent sx={{ pt: '12px !important' }}>
                <Stack spacing={2}>
                    {(errorMessage || successMessage) && (
                        <Alert severity={successMessage ? 'success' : 'error'}>
                            {successMessage || errorMessage}
                        </Alert>
                    )}

                    <Box>
                        <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '14px', fontWeight: 800, color: '#222222', mb: '8px' }}>
                            Criar categoria
                        </Typography>
                        <Box sx={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <TextField
                                fullWidth
                                size="small"
                                value={newCategoryName}
                                onChange={(event) => {
                                    setNewCategoryName(event.target.value.slice(0, VALIDATION_LIMITS.categoryNameMax));
                                    setNewCategoryError('');
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault();
                                        handleCreateCategory();
                                    }
                                }}
                                placeholder="Nome da categoria"
                                error={Boolean(newCategoryError)}
                                helperText={newCategoryError || `${newCategoryName.length}/${VALIDATION_LIMITS.categoryNameMax}`}
                                slotProps={{
                                    htmlInput: {
                                        maxLength: VALIDATION_LIMITS.categoryNameMax,
                                    },
                                }}
                                sx={dialogInputSx}
                            />
                            <Button
                                onClick={handleCreateCategory}
                                disabled={busyAction === 'create'}
                                startIcon={<AddIcon fontSize="small" />}
                                sx={{
                                    height: '40px',
                                    minWidth: '96px',
                                    backgroundColor: COLOR_ORANGE,
                                    color: '#FFFFFF',
                                    borderRadius: '6px',
                                    fontFamily: FONT_PRIMARY,
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    '&:hover': { backgroundColor: '#D98E04' },
                                }}
                            >
                                {busyAction === 'create' ? 'Criando...' : 'Criar'}
                            </Button>
                        </Box>
                    </Box>

                    <Divider />

                    <Box>
                        <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '14px', fontWeight: 800, color: '#222222', mb: '8px' }}>
                            Categorias existentes
                        </Typography>

                        {categories.length === 0 && (
                            <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '13px', color: '#666666' }}>
                                Nenhuma categoria cadastrada.
                            </Typography>
                        )}

                        <Stack spacing={1}>
                            {categories.map((category) => {
                                const isEditing = editingCategoryId === category.id;
                                const isDeleteCandidate = deleteCandidate?.id === category.id;
                                const isSelected = selectedCategory === category.name;

                                return (
                                    <Box
                                        key={category.id}
                                        sx={{
                                            border: '1px solid #E0E5EC',
                                            borderRadius: '6px',
                                            p: '10px',
                                            backgroundColor: '#FFFFFF',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {isEditing ? (
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    value={editingCategoryName}
                                                    onChange={(event) => {
                                                        setEditingCategoryName(event.target.value.slice(0, VALIDATION_LIMITS.categoryNameMax));
                                                        setEditingCategoryError('');
                                                    }}
                                                    onKeyDown={(event) => {
                                                        if (event.key === 'Enter') {
                                                            event.preventDefault();
                                                            handleSaveEdit(category);
                                                        }
                                                    }}
                                                    error={Boolean(editingCategoryError)}
                                                    helperText={editingCategoryError || `${editingCategoryName.length}/${VALIDATION_LIMITS.categoryNameMax}`}
                                                    slotProps={{
                                                        htmlInput: {
                                                            maxLength: VALIDATION_LIMITS.categoryNameMax,
                                                        },
                                                    }}
                                                    sx={dialogInputSx}
                                                />
                                            ) : (
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '14px', fontWeight: 700, color: '#222222', wordBreak: 'break-word' }}>
                                                        {category.name}
                                                    </Typography>
                                                </Box>
                                            )}

                                            {isSelected && !isEditing && (
                                                <Chip
                                                    label="Selecionada"
                                                    size="small"
                                                    sx={{ fontFamily: FONT_PRIMARY, fontSize: '11px', fontWeight: 700 }}
                                                />
                                            )}

                                            {isEditing ? (
                                                <>
                                                    <Tooltip title="Salvar categoria">
                                                        <IconButton
                                                            onClick={() => handleSaveEdit(category)}
                                                            disabled={busyAction === `edit-${category.id}`}
                                                            size="small"
                                                            sx={{ color: COLOR_ORANGE }}
                                                        >
                                                            <CheckIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Cancelar edicao">
                                                        <IconButton
                                                            onClick={() => {
                                                                setEditingCategoryId(null);
                                                                setEditingCategoryName('');
                                                                setEditingCategoryError('');
                                                            }}
                                                            size="small"
                                                        >
                                                            <CloseIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            ) : (
                                                <>
                                                    <Tooltip title="Editar categoria">
                                                        <IconButton
                                                            onClick={() => handleStartEdit(category)}
                                                            size="small"
                                                            sx={{ color: '#333333' }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Excluir categoria">
                                                        <IconButton
                                                            onClick={() => {
                                                                setDeleteCandidate(category);
                                                                setEditingCategoryId(null);
                                                                setEditingCategoryName('');
                                                            }}
                                                            size="small"
                                                            sx={{ color: '#9E2B25' }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </Box>

                                        {isDeleteCandidate && (
                                            <Box sx={{ mt: '10px', p: '10px', borderRadius: '6px', backgroundColor: '#FFF7E8' }}>
                                                <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '12px', color: '#333333', mb: '8px' }}>
                                                    Excluir esta categoria? Categorias usadas por receitas nao podem ser excluidas.
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <Button
                                                        onClick={() => handleDeleteCategory(category)}
                                                        disabled={busyAction === `delete-${category.id}`}
                                                        sx={{
                                                            height: '30px',
                                                            minWidth: '94px',
                                                            color: '#FFFFFF',
                                                            backgroundColor: '#9E2B25',
                                                            borderRadius: '6px',
                                                            fontFamily: FONT_PRIMARY,
                                                            fontSize: '12px',
                                                            fontWeight: 700,
                                                            textTransform: 'none',
                                                            '&:hover': { backgroundColor: '#81211D' },
                                                        }}
                                                    >
                                                        {busyAction === `delete-${category.id}` ? 'Excluindo...' : 'Excluir'}
                                                    </Button>
                                                    <Button
                                                        onClick={() => setDeleteCandidate(null)}
                                                        sx={{
                                                            height: '30px',
                                                            minWidth: '84px',
                                                            color: '#333333',
                                                            borderRadius: '6px',
                                                            fontFamily: FONT_PRIMARY,
                                                            fontSize: '12px',
                                                            fontWeight: 700,
                                                            textTransform: 'none',
                                                        }}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                </Box>
                                            </Box>
                                        )}
                                    </Box>
                                );
                            })}
                        </Stack>
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={onClose}
                    sx={{
                        color: '#333333',
                        borderRadius: '6px',
                        fontFamily: FONT_PRIMARY,
                        fontWeight: 700,
                        textTransform: 'none',
                    }}
                >
                    Fechar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CategoryManagerDialog;
