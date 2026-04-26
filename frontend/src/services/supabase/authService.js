import { requireSupabase } from '@/lib/supabase/client';

export async function getSession() {
    const client = requireSupabase();
    const { data, error } = await client.auth.getSession();

    if (error) throw error;

    return data.session;
}

export async function signInWithPassword({ email, password }) {
    const client = requireSupabase();
    const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;

    return data;
}

export async function signUpWithPassword({ email, password, fullName }) {
    const client = requireSupabase();
    const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    });

    if (error) throw error;

    return data;
}

export async function resetPasswordForEmail(email) {
    const client = requireSupabase();
    const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
    });

    if (error) throw error;
}

export async function signOut() {
    const client = requireSupabase();
    const { error } = await client.auth.signOut();

    if (error) throw error;
}
