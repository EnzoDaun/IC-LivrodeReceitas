import { requireSupabase } from '@/lib/supabase/client';
import {
    VALIDATION_LIMITS,
    getFirstValidationMessage,
    normalizeSpaces,
    validateCategoryName,
    validateImageFiles,
    validateIntegerRange,
    validateRequiredText,
} from '@/utils/validation';

const DEFAULT_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'recipe-images';
const DIFFICULTY_OPTIONS = ['Fácil', 'Médio', 'Difícil'];
const RECIPE_SELECT = `
    id,
    author_id,
    title,
    description,
    category,
    difficulty,
    prep_time_minutes,
    portions,
    average_rating,
    rating_count,
    is_published,
    created_at,
    recipe_images (
        id,
        path,
        public_url,
        is_cover,
        sort_order
    ),
    recipe_ingredients (
        id,
        content,
        sort_order
    ),
    recipe_steps (
        id,
        content,
        sort_order
    )
`;

function normalizeOrder(items) {
    return items
        .map(normalizeSpaces)
        .filter(Boolean)
        .map((item, index) => ({
            content: item,
            sort_order: index,
        }));
}

function normalizeCategoryName(name) {
    return normalizeSpaces(name);
}

function validateRecipePayload({
    title,
    description,
    category,
    difficulty,
    prepTimeMinutes,
    portions,
    ingredients,
    instructions,
    files,
}) {
    const normalizedIngredients = (ingredients || []).map(normalizeSpaces).filter(Boolean);
    const normalizedInstructions = (instructions || []).map(normalizeSpaces).filter(Boolean);
    const ingredientErrors = normalizedIngredients.map((ingredient, index) => (
        validateRequiredText(ingredient, {
            label: `o ingrediente ${index + 1}`,
            min: VALIDATION_LIMITS.ingredientMin,
            max: VALIDATION_LIMITS.ingredientMax,
        })
    ));
    const instructionErrors = normalizedInstructions.map((instruction, index) => (
        validateRequiredText(instruction, {
            label: `a instrucao ${index + 1}`,
            min: VALIDATION_LIMITS.stepMin,
            max: VALIDATION_LIMITS.stepMax,
        })
    ));
    const errors = {
        title: validateRequiredText(title, {
            label: 'o titulo da receita',
            min: VALIDATION_LIMITS.recipeTitleMin,
            max: VALIDATION_LIMITS.recipeTitleMax,
        }),
        description: validateRequiredText(description, {
            label: 'a descricao da receita',
            min: VALIDATION_LIMITS.recipeDescriptionMin,
            max: VALIDATION_LIMITS.recipeDescriptionMax,
        }),
        category: validateCategoryName(category),
        difficulty: DIFFICULTY_OPTIONS.includes(difficulty) ? '' : 'Selecione uma dificuldade: Fácil, Médio ou Difícil.',
        prepTimeMinutes: validateIntegerRange(prepTimeMinutes, {
            label: 'o tempo de preparo',
            min: VALIDATION_LIMITS.prepTimeMin,
            max: VALIDATION_LIMITS.prepTimeMax,
        }),
        portions: validateIntegerRange(portions, {
            label: 'as porcoes',
            min: VALIDATION_LIMITS.portionsMin,
            max: VALIDATION_LIMITS.portionsMax,
        }),
        files: validateImageFiles(files || []),
        ingredients: normalizedIngredients.length > 0
            ? ingredientErrors.find(Boolean) || ''
            : 'Informe pelo menos um ingrediente.',
        instructions: normalizedInstructions.length > 0
            ? instructionErrors.find(Boolean) || ''
            : 'Informe pelo menos uma instrucao.',
    };
    const validationMessage = getFirstValidationMessage(errors);

    if (validationMessage) {
        throw new Error(validationMessage);
    }
}

export async function listRecipeCategories() {
    const client = requireSupabase();
    const { data, error } = await client
        .from('recipe_categories')
        .select('id, name')
        .order('name', { ascending: true });

    if (error) throw error;

    return data || [];
}

export async function createRecipeCategory(name) {
    const client = requireSupabase();
    const categoryName = normalizeCategoryName(name);

    if (!categoryName) {
        throw new Error('Informe o nome da categoria.');
    }

    const validationMessage = validateCategoryName(categoryName);

    if (validationMessage) {
        throw new Error(validationMessage);
    }

    const { data, error } = await client
        .from('recipe_categories')
        .insert({ name: categoryName })
        .select('id, name')
        .single();

    if (!error) return data;

    if (error.code === '23505') {
        const { data: existingCategory, error: existingCategoryError } = await client
            .from('recipe_categories')
            .select('id, name')
            .eq('name', categoryName)
            .single();

        if (!existingCategoryError && existingCategory) {
            return existingCategory;
        }
    }

    throw error;
}

export async function updateRecipeCategory({ categoryId, name }) {
    const client = requireSupabase();
    const categoryName = normalizeCategoryName(name);

    if (!categoryId) {
        throw new Error('Categoria invalida.');
    }

    if (!categoryName) {
        throw new Error('Informe o nome da categoria.');
    }

    const validationMessage = validateCategoryName(categoryName);

    if (validationMessage) {
        throw new Error(validationMessage);
    }

    const { data, error } = await client
        .from('recipe_categories')
        .update({
            name: categoryName,
            updated_at: new Date().toISOString(),
        })
        .eq('id', categoryId)
        .select('id, name')
        .single();

    if (error?.code === '23505') {
        throw new Error('Essa categoria ja existe.');
    }

    if (error) throw error;

    return data;
}

export async function deleteRecipeCategory({ categoryId, name }) {
    const client = requireSupabase();

    if (!categoryId) {
        throw new Error('Categoria invalida.');
    }

    const { count, error: countError } = await client
        .from('recipes')
        .select('id', { count: 'exact', head: true })
        .eq('category', name);

    if (countError) throw countError;

    if ((count || 0) > 0) {
        throw new Error('Nao e possivel excluir uma categoria usada por receitas.');
    }

    const { error } = await client
        .from('recipe_categories')
        .delete()
        .eq('id', categoryId);

    if (error?.code === '23503') {
        throw new Error('Nao e possivel excluir uma categoria usada por receitas.');
    }

    if (error) throw error;
}

async function uploadRecipeImages(client, { authorId, recipeId, files }) {
    if (!files.length) return [];

    const uploads = [];

    for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        const extension = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${extension}`;
        const path = `${authorId}/${recipeId}/${fileName}`;

        const { error: uploadError } = await client.storage
            .from(DEFAULT_BUCKET)
            .upload(path, file, {
                upsert: false,
            });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = client.storage
            .from(DEFAULT_BUCKET)
            .getPublicUrl(path);

        uploads.push({
            recipe_id: recipeId,
            path,
            public_url: publicUrlData.publicUrl,
            is_cover: index === 0,
            sort_order: index,
        });
    }

    return uploads;
}

async function removeRecipeImageFiles(client, paths) {
    const pathsToRemove = paths.filter(Boolean);

    if (pathsToRemove.length === 0) return;

    const { error } = await client.storage
        .from(DEFAULT_BUCKET)
        .remove(pathsToRemove);

    if (error) throw error;
}

function sortRecipeCollections(recipe) {
    return {
        ...recipe,
        recipe_images: [...(recipe.recipe_images || [])].sort((a, b) => a.sort_order - b.sort_order),
        recipe_ingredients: [...(recipe.recipe_ingredients || [])].sort((a, b) => a.sort_order - b.sort_order),
        recipe_steps: [...(recipe.recipe_steps || [])].sort((a, b) => a.sort_order - b.sort_order),
    };
}

export async function searchPublishedRecipes(query, { limit = 8 } = {}) {
    const client = requireSupabase();
    const { data, error } = await client
        .from('recipes')
        .select(`
            id,
            title,
            recipe_images (
                public_url,
                is_cover,
                sort_order
            )
        `)
        .eq('is_published', true)
        .ilike('title', `%${query}%`)
        .order('title', { ascending: true })
        .limit(limit);

    if (error) throw error;

    const DEFAULT_IMAGE = '/assets/recipes/RecipeImage.png';

    return (data || []).map((recipe) => {
        const images = [...(recipe.recipe_images || [])].sort((a, b) => a.sort_order - b.sort_order);
        const cover = images.find((img) => img.is_cover) || images[0];
        return {
            id: recipe.id,
            title: recipe.title,
            imageUrl: cover?.public_url || DEFAULT_IMAGE,
        };
    });
}

export async function listPublishedRecipes({ limit } = {}) {
    const client = requireSupabase();
    let query = client
        .from('recipes')
        .select(RECIPE_SELECT)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map(sortRecipeCollections);
}

export async function listTopRatedPublishedRecipes({ limit = 6 } = {}) {
    const client = requireSupabase();
    const { data, error } = await client
        .from('recipes')
        .select(RECIPE_SELECT)
        .eq('is_published', true);

    if (error) throw error;

    return (data || [])
        .map(sortRecipeCollections)
        .filter((r) => (r.rating_count || 0) > 0)
        .sort((a, b) => {
            const scoreA = (a.average_rating || 0) * (a.rating_count || 0);
            const scoreB = (b.average_rating || 0) * (b.rating_count || 0);
            return scoreB - scoreA;
        })
        .slice(0, limit);
}

export async function listRecipesByAuthor(authorId) {
    const client = requireSupabase();
    const { data, error } = await client
        .from('recipes')
        .select(RECIPE_SELECT)
        .eq('author_id', authorId)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(sortRecipeCollections);
}

export async function listManagedRecipes({ userId, isAdmin }) {
    const client = requireSupabase();
    let query = client
        .from('recipes')
        .select(RECIPE_SELECT)
        .order('created_at', { ascending: false });

    if (!isAdmin) {
        query = query.eq('author_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map(sortRecipeCollections);
}

export async function getRecipeById(recipeId) {
    const client = requireSupabase();
    const { data, error } = await client
        .from('recipes')
        .select(RECIPE_SELECT)
        .eq('id', recipeId)
        .single();

    if (error) throw error;

    return sortRecipeCollections(data);
}

export async function listFavoriteRecipes(userId) {
    const client = requireSupabase();
    const { data, error } = await client
        .from('favorite_recipes')
        .select(`
            recipe_id,
            recipes (
                ${RECIPE_SELECT}
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || [])
        .map((item) => item.recipes)
        .filter(Boolean)
        .map(sortRecipeCollections)
        .map((recipe) => ({
            ...recipe,
            is_favorite: true,
        }));
}

export async function listFavoriteRecipeIds(userId) {
    const client = requireSupabase();
    const { data, error } = await client
        .from('favorite_recipes')
        .select('recipe_id')
        .eq('user_id', userId);

    if (error) throw error;

    return new Set((data || []).map((item) => item.recipe_id));
}

export async function toggleFavoriteRecipe({ userId, recipeId, shouldFavorite }) {
    const client = requireSupabase();

    if (shouldFavorite) {
        const { error } = await client
            .from('favorite_recipes')
            .upsert(
                {
                    user_id: userId,
                    recipe_id: recipeId,
                },
                {
                    onConflict: 'user_id,recipe_id',
                }
            );

        if (error) throw error;
        return;
    }

    const { error } = await client
        .from('favorite_recipes')
        .delete()
        .eq('user_id', userId)
        .eq('recipe_id', recipeId);

    if (error) throw error;
}

export async function createRecipe({
    authorId,
    title,
    description,
    category,
    difficulty,
    prepTimeMinutes,
    portions,
    ingredients,
    instructions,
    files,
}) {
    const client = requireSupabase();
    validateRecipePayload({
        title,
        description,
        category,
        difficulty,
        prepTimeMinutes,
        portions,
        ingredients,
        instructions,
        files,
    });

    const { data: recipe, error: recipeError } = await client
        .from('recipes')
        .insert({
            author_id: authorId,
            title: normalizeSpaces(title),
            description: normalizeSpaces(description),
            category: normalizeCategoryName(category),
            difficulty,
            prep_time_minutes: prepTimeMinutes,
            portions,
            is_published: true,
        })
        .select('id')
        .single();

    if (recipeError) throw recipeError;

    const recipeId = recipe.id;
    const normalizedIngredients = normalizeOrder(ingredients).map((item) => ({
        recipe_id: recipeId,
        ...item,
    }));
    const normalizedInstructions = normalizeOrder(instructions).map((item) => ({
        recipe_id: recipeId,
        ...item,
    }));
    const uploadedImages = await uploadRecipeImages(client, {
        authorId,
        recipeId,
        files,
    });

    if (normalizedIngredients.length > 0) {
        const { error } = await client.from('recipe_ingredients').insert(normalizedIngredients);
        if (error) throw error;
    }

    if (normalizedInstructions.length > 0) {
        const { error } = await client.from('recipe_steps').insert(normalizedInstructions);
        if (error) throw error;
    }

    if (uploadedImages.length > 0) {
        const { error } = await client.from('recipe_images').insert(uploadedImages);
        if (error) throw error;
    }

    return recipeId;
}

export async function updateRecipe({
    recipeId,
    authorId,
    title,
    description,
    category,
    difficulty,
    prepTimeMinutes,
    portions,
    ingredients,
    instructions,
    files,
}) {
    const client = requireSupabase();
    validateRecipePayload({
        title,
        description,
        category,
        difficulty,
        prepTimeMinutes,
        portions,
        ingredients,
        instructions,
        files,
    });
    const normalizedIngredients = normalizeOrder(ingredients).map((item) => ({
        recipe_id: recipeId,
        ...item,
    }));
    const normalizedInstructions = normalizeOrder(instructions).map((item) => ({
        recipe_id: recipeId,
        ...item,
    }));

    const { data: currentImages, error: currentImagesError } = await client
        .from('recipe_images')
        .select('path')
        .eq('recipe_id', recipeId);

    if (currentImagesError) throw currentImagesError;

    const { error: recipeError } = await client
        .from('recipes')
        .update({
            title: normalizeSpaces(title),
            description: normalizeSpaces(description),
            category: normalizeCategoryName(category),
            difficulty,
            prep_time_minutes: prepTimeMinutes,
            portions,
            updated_at: new Date().toISOString(),
        })
        .eq('id', recipeId);

    if (recipeError) throw recipeError;

    const { error: ingredientsDeleteError } = await client
        .from('recipe_ingredients')
        .delete()
        .eq('recipe_id', recipeId);

    if (ingredientsDeleteError) throw ingredientsDeleteError;

    if (normalizedIngredients.length > 0) {
        const { error } = await client.from('recipe_ingredients').insert(normalizedIngredients);
        if (error) throw error;
    }

    const { error: instructionsDeleteError } = await client
        .from('recipe_steps')
        .delete()
        .eq('recipe_id', recipeId);

    if (instructionsDeleteError) throw instructionsDeleteError;

    if (normalizedInstructions.length > 0) {
        const { error } = await client.from('recipe_steps').insert(normalizedInstructions);
        if (error) throw error;
    }

    if (files.length > 0) {
        const currentImagePaths = (currentImages || []).map((image) => image.path);
        const uploadedImages = await uploadRecipeImages(client, {
            authorId,
            recipeId,
            files,
        });

        if (uploadedImages.length > 0) {
            const { error } = await client.from('recipe_images').insert(uploadedImages);
            if (error) throw error;
        }

        if (currentImagePaths.length > 0) {
            const { error: imagesDeleteError } = await client
                .from('recipe_images')
                .delete()
                .in('path', currentImagePaths);

            if (imagesDeleteError) throw imagesDeleteError;

            await removeRecipeImageFiles(client, currentImagePaths);
        }
    }

    return recipeId;
}

export async function deleteRecipe(recipeId) {
    const client = requireSupabase();
    const { data: currentImages, error: currentImagesError } = await client
        .from('recipe_images')
        .select('path')
        .eq('recipe_id', recipeId);

    if (currentImagesError) throw currentImagesError;

    const currentImagePaths = (currentImages || []).map((image) => image.path);
    await removeRecipeImageFiles(client, currentImagePaths);

    const { error } = await client
        .from('recipes')
        .delete()
        .eq('id', recipeId);

    if (error) throw error;
}
