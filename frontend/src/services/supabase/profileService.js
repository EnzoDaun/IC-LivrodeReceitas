import { requireSupabase } from '@/lib/supabase/client';

export async function getProfile(userId) {
    const client = requireSupabase();
    const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

    if (error) throw error;

    return data;
}
