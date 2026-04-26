import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FONT_PRIMARY, COLOR_ORANGE } from '@/config/constants/styles';
import { useAuth } from '@/hooks/useAuth';
import { createRecipe, updateRecipe } from '@/services/supabase/recipeService';

const cardSx = {
    width: '100%',
    borderRadius: '7px',
    boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
    backgroundColor: '#FFFFFF',
    p: '20px 20px 24px 20px',
    boxSizing: 'border-box',
};

const inputSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '6px',
        backgroundColor: '#FFFFFF',
        '& fieldset': {
            borderColor: '#8FA0B7',
            borderWidth: '1px',
            top: 0,
        },
        '& fieldset legend': { display: 'none' },
        '&:hover fieldset': { borderColor: '#8FA0B7' },
        '&.Mui-focused fieldset': { borderColor: '#8FA0B7', borderWidth: '1px' },
    },
    '& .MuiOutlinedInput-input': {
        p: '0 12px',
        fontFamily: FONT_PRIMARY,
        fontSize: '14px',
        color: '#111111',
    },
};

const emptyFormValues = {
    title: '',
    description: '',
    category: '',
    difficulty: '',
    prepTimeMinutes: '',
    portions: '',
};

function mapCollectionToInputs(collection) {
    const values = (collection || [])
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((item) => item.content)
        .filter(Boolean);

    return values.length > 0 ? values : [''];
}

function SectionTitle({ children }) {
    return (
        <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '18px', fontWeight: 800, color: '#222222', mb: '16px' }}>
            {children}
        </Typography>
    );
}

function FieldLabel({ children, sx: extraSx }) {
    return (
        <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '13px', fontWeight: 700, color: '#222222', mb: '5px', ...extraSx }}>
            {children}
        </Typography>
    );
}

function FormField({
    label,
    height = 40,
    multiline = false,
    rows,
    sx: extraSx,
    value,
    onChange,
    type = 'text',
    placeholder = '',
}) {
    return (
        <Box>
            <FieldLabel>{label}</FieldLabel>
            <TextField
                variant="outlined"
                fullWidth
                multiline={multiline}
                rows={rows}
                value={value}
                onChange={onChange}
                type={type}
                placeholder={placeholder}
                sx={{
                    ...inputSx,
                    '& .MuiOutlinedInput-input': {
                        ...inputSx['& .MuiOutlinedInput-input'],
                        height: multiline ? 'auto' : `${height}px`,
                        p: multiline ? '10px 12px' : '0 12px',
                    },
                    '& .MuiInputBase-root': { height: multiline ? 'auto' : `${height}px` },
                    ...extraSx,
                }}
            />
        </Box>
    );
}

function DynamicListSection({ title, addLabel, items, onChange, placeholder }) {
    return (
        <Paper elevation={0} sx={cardSx}>
            <SectionTitle>{title}</SectionTitle>
            <Box sx={{ pl: '28px' }}>
                <FieldLabel>{placeholder}</FieldLabel>
            </Box>
            {items.map((item, index) => (
                <Box key={`${title}-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: '6px', mb: '6px' }}>
                    <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '14px', fontWeight: 500, color: '#222222', flexShrink: 0, width: '22px' }}>
                        {index + 1}.
                    </Typography>
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={item}
                        onChange={(event) => {
                            const nextItems = [...items];
                            nextItems[index] = event.target.value;
                            onChange(nextItems);
                        }}
                        sx={{
                            ...inputSx,
                            '& .MuiInputBase-root': { height: '40px' },
                            '& .MuiOutlinedInput-input': {
                                ...inputSx['& .MuiOutlinedInput-input'],
                                height: '40px',
                            },
                        }}
                    />
                </Box>
            ))}
            <Typography
                onClick={() => onChange([...items, ''])}
                sx={{ fontFamily: FONT_PRIMARY, fontSize: '13px', fontWeight: 700, color: COLOR_ORANGE, cursor: 'pointer', mt: '12px', pl: '28px' }}
            >
                {addLabel}
            </Typography>
        </Paper>
    );
}

const AddRecipeForm = ({ mode = 'create', initialRecipe = null }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const fileInputRef = useRef(null);
    const isEditMode = mode === 'edit';
    const [formValues, setFormValues] = useState(emptyFormValues);
    const [ingredients, setIngredients] = useState(['']);
    const [instructions, setInstructions] = useState(['']);
    const [files, setFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (!isEditMode || !initialRecipe) return;

        setFormValues({
            title: initialRecipe.title || '',
            description: initialRecipe.description || '',
            category: initialRecipe.category || '',
            difficulty: initialRecipe.difficulty || '',
            prepTimeMinutes: String(initialRecipe.prep_time_minutes || ''),
            portions: String(initialRecipe.portions || ''),
        });
        setIngredients(mapCollectionToInputs(initialRecipe.recipe_ingredients));
        setInstructions(mapCollectionToInputs(initialRecipe.recipe_steps));
        setFiles([]);
    }, [initialRecipe, isEditMode]);

    const handleFieldChange = (field) => (event) => {
        setFormValues((currentValues) => ({
            ...currentValues,
            [field]: event.target.value,
        }));
    };

    const handleSelectFiles = (event) => {
        setFiles(Array.from(event.target.files || []).slice(0, 5));
    };

    const handleSubmit = async () => {
        setErrorMessage('');
        setSuccessMessage('');

        try {
            setIsSubmitting(true);

            if (!formValues.title.trim()) {
                throw new Error('Informe o titulo da receita.');
            }

            if (!formValues.description.trim()) {
                throw new Error('Informe a descricao da receita.');
            }

            const payload = {
                title: formValues.title.trim(),
                description: formValues.description.trim(),
                category: formValues.category.trim(),
                difficulty: formValues.difficulty.trim(),
                prepTimeMinutes: Number(formValues.prepTimeMinutes || 0),
                portions: Number(formValues.portions || 0),
                ingredients,
                instructions,
                files,
            };

            if (isEditMode) {
                await updateRecipe({
                    ...payload,
                    recipeId: initialRecipe.id,
                    authorId: initialRecipe.author_id || user.id,
                });

                setSuccessMessage('Receita atualizada com sucesso.');
                navigate('/receitas', { replace: true });
                return;
            }

            await createRecipe({
                ...payload,
                authorId: user.id,
            });

            setSuccessMessage('Receita criada com sucesso.');
            navigate('/receitas', { replace: true });
        } catch (error) {
            setErrorMessage(error.message || 'Nao foi possivel salvar a receita.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box sx={{ maxWidth: '680px', mt: '32px', mx: 'auto' }}>
            <Box sx={{ mb: '16px' }}>
                <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '24px', fontWeight: 800, color: '#111111', lineHeight: '28px' }}>
                    {isEditMode ? 'Editar receita' : '+ Adicionar nova receita'}
                </Typography>
                <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '14px', fontWeight: 400, color: '#333333', lineHeight: '18px' }}>
                    {isEditMode ? 'Atualize as informacoes da receita' : 'Compartilhe suas receitas com o mundo'}
                </Typography>
            </Box>

            {(errorMessage || successMessage) && (
                <Alert severity={successMessage ? 'success' : 'error'} sx={{ mb: '12px' }}>
                    {successMessage || errorMessage}
                </Alert>
            )}

            <Paper elevation={0} sx={{ ...cardSx, mb: '12px' }}>
                <SectionTitle>Informacoes basicas</SectionTitle>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <FormField label="Titulo da receita" height={26} value={formValues.title} onChange={handleFieldChange('title')} />
                    <FormField label="Descricao" multiline rows={2} value={formValues.description} onChange={handleFieldChange('description')} />
                    <Box sx={{ display: 'flex', gap: '16px' }}>
                        <Box sx={{ flex: 1 }}>
                            <FormField label="Categoria" height={26} value={formValues.category} onChange={handleFieldChange('category')} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <FormField label="Dificuldade" height={26} value={formValues.difficulty} onChange={handleFieldChange('difficulty')} placeholder="Facil, Medio, Dificil" />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: '16px' }}>
                        <Box sx={{ flex: 1 }}>
                            <FormField label="Tempo de preparo (min)" height={26} value={formValues.prepTimeMinutes} onChange={handleFieldChange('prepTimeMinutes')} type="number" />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <FormField label="Porcoes" height={26} value={formValues.portions} onChange={handleFieldChange('portions')} type="number" />
                        </Box>
                    </Box>
                </Box>
            </Paper>

            <Paper elevation={0} sx={{ ...cardSx, mb: '12px' }}>
                <SectionTitle>Imagens</SectionTitle>
                <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    accept="image/png,image/jpeg,image/jpg"
                    multiple
                    onChange={handleSelectFiles}
                />
                <Box
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                        width: '100%',
                        height: '126px',
                        border: '1px dashed #777777',
                        borderRadius: '5px',
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                    }}
                >
                    <Typography sx={{ fontSize: '28px', mb: '8px', lineHeight: 1 }}>+</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '13px', fontWeight: 700, color: COLOR_ORANGE }}>
                            Clique aqui
                        </Typography>
                        <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '13px', fontWeight: 700, color: '#222222' }}>
                            para inserir imagens
                        </Typography>
                    </Box>
                    <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '12px', fontWeight: 400, color: '#666666', mt: '4px' }}>
                        PNG ou JPG ate 10MB
                    </Typography>
                    <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '10px', fontWeight: 400, color: '#9A9A9A', mt: '3px' }}>
                        {`${files.length} de 5 imagens selecionadas`}
                    </Typography>
                    {isEditMode && (
                        <Typography sx={{ fontFamily: FONT_PRIMARY, fontSize: '10px', fontWeight: 400, color: '#9A9A9A', mt: '3px' }}>
                            {files.length > 0
                                ? 'As imagens atuais serao substituidas'
                                : `${initialRecipe?.recipe_images?.length || 0} imagens atuais`}
                        </Typography>
                    )}
                </Box>
            </Paper>

            <Box sx={{ mb: '12px' }}>
                <DynamicListSection
                    title="Ingredientes"
                    addLabel="+ Adicionar ingrediente"
                    items={ingredients}
                    onChange={setIngredients}
                    placeholder="Descreva cada ingrediente"
                />
            </Box>

            <DynamicListSection
                title="Instrucoes"
                addLabel="+ Adicionar instrucao"
                items={instructions}
                onChange={setInstructions}
                placeholder="Descreva o passo"
            />

            <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                sx={{
                    mt: '18px',
                    width: '100%',
                    height: '46px',
                    backgroundColor: COLOR_ORANGE,
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    fontFamily: FONT_PRIMARY,
                    fontWeight: 700,
                    '&:hover': {
                        backgroundColor: '#D98E04',
                    },
                }}
            >
                {isSubmitting ? 'Salvando...' : (isEditMode ? 'Atualizar receita' : 'Salvar receita')}
            </Button>
        </Box>
    );
};

export default AddRecipeForm;
