const DEFAULT_RECIPE_IMAGE = '/assets/recipes/RecipeImage.png';

function truncateText(value, maxLength = 120) {
    if (!value) return '';
    if (value.length <= maxLength) return value;
    return `${value.slice(0, maxLength).trim()}...`;
}

function formatPrepTime(minutes) {
    if (!minutes || Number.isNaN(Number(minutes))) {
        return 'SEM TEMPO';
    }

    return `${minutes} MIN`;
}

function formatPortions(portions) {
    const portionCount = Number(portions);

    if (!portionCount || Number.isNaN(portionCount)) {
        return 'SEM PORÇÕES';
    }

    return `${portionCount} ${portionCount === 1 ? 'PORÇÃO' : 'PORÇÕES'}`;
}

function resolveImageUrl(recipe) {
    const coverImage = recipe.recipe_images?.find((image) => image.is_cover)
        || recipe.recipe_images?.[0];

    return coverImage?.public_url || DEFAULT_RECIPE_IMAGE;
}

export function mapRecipeToCard(recipe) {
    return {
        id: recipe.id,
        title: recipe.title,
        excerpt: truncateText(recipe.description),
        description: recipe.description,
        category: recipe.category,
        imageUrl: resolveImageUrl(recipe),
        rating: Number(recipe.average_rating || 0),
        prepTimeMinutes: Number(recipe.prep_time_minutes || 0),
        time: formatPrepTime(recipe.prep_time_minutes),
        difficulty: recipe.difficulty || 'SEM NÍVEL',
        portions: formatPortions(recipe.portions),
        createdAt: recipe.created_at,
        isFavorite: Boolean(recipe.is_favorite),
    };
}

export function mapRecipeToJourneyCard(recipe) {
    return {
        ...mapRecipeToCard(recipe),
        meta: `${formatPrepTime(recipe.prep_time_minutes)} · ${recipe.difficulty || 'SEM NÍVEL'} · ${formatPortions(recipe.portions)}`,
    };
}

export function mapRecipeToDetail(recipe) {
    return {
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        category: recipe.category,
        difficulty: recipe.difficulty || 'SEM NÍVEL',
        prepTime: formatPrepTime(recipe.prep_time_minutes),
        portions: formatPortions(recipe.portions),
        rating: Number(recipe.average_rating || 0),
        ratingCount: Number(recipe.rating_count || 0),
        imageUrl: resolveImageUrl(recipe),
        images: recipe.recipe_images || [],
        ingredients: recipe.recipe_ingredients || [],
        steps: recipe.recipe_steps || [],
        createdAt: recipe.created_at,
    };
}

export function mapDashboardStats(recipes) {
    const totalRecipes = recipes.length;
    const publishedRecipes = recipes.filter((recipe) => recipe.is_published).length;
    const ratings = recipes
        .map((recipe) => Number(recipe.average_rating || 0))
        .filter((rating) => rating > 0);

    const averageRating = ratings.length
        ? (ratings.reduce((total, rating) => total + rating, 0) / ratings.length).toFixed(1)
        : '0.0';

    return [
        {
            label: 'Total de receitas',
            value: String(totalRecipes),
            description: `${publishedRecipes} publicadas`,
        },
        {
            label: 'Média de avaliações',
            value: averageRating,
            description: 'De 5 estrelas',
        },
        {
            label: 'Reviews totais',
            value: '0',
            description: 'Reservado para próximas iterações',
        },
    ];
}
