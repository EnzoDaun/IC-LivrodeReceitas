import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(
    supabaseUrl && supabasePublishableKey
);

export const supabaseConfigurationMessage = isSupabaseConfigured
    ? ''
    : 'Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY para habilitar o Supabase.';

export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl, supabasePublishableKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
        },
        db: {
            schema: 'public',
        },
    })
    : null;

export function requireSupabase() {
    if (!supabase) {
        throw new Error(supabaseConfigurationMessage);
    }

    return supabase;
}
