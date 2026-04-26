import { requireSupabase } from '@/lib/supabase/client';

export async function submitRating({ recipeId, userId, rating }) {
    const client = requireSupabase();
    const { error } = await client
        .from('recipe_ratings')
        .upsert(
            {
                recipe_id: recipeId,
                user_id: userId,
                rating,
            },
            { onConflict: 'recipe_id,user_id' }
        );

    if (error) throw error;
}

export async function getUserRating({ recipeId, userId }) {
    const client = requireSupabase();
    const { data, error } = await client
        .from('recipe_ratings')
        .select('rating')
        .eq('recipe_id', recipeId)
        .eq('user_id', userId)
        .maybeSingle();

    if (error) throw error;

    return data?.rating ?? null;
}
