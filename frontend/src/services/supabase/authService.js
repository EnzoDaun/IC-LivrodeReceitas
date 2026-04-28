import { requireSupabase } from '@/lib/supabase/client';
import {
    normalizeEmail,
    normalizeSpaces,
    validateEmail,
    validateFullName,
    validatePasswordForLogin,
    validatePasswordForRegister,
} from '@/utils/validation';

export async function getSession() {
    const client = requireSupabase();
    const { data, error } = await client.auth.getSession();

    if (error) throw error;

    return data.session;
}

export async function signInWithPassword({ email, password }) {
    const client = requireSupabase();
    const emailError = validateEmail(email);
    const passwordError = validatePasswordForLogin(password);

    if (emailError || passwordError) {
        throw new Error(emailError || passwordError);
    }

    const { data, error } = await client.auth.signInWithPassword({
        email: normalizeEmail(email),
        password,
    });

    if (error) throw error;

    return data;
}

export async function signUpWithPassword({ email, password, fullName }) {
    const client = requireSupabase();
    const emailError = validateEmail(email);
    const passwordError = validatePasswordForRegister(password);
    const fullNameError = validateFullName(fullName);

    if (emailError || passwordError || fullNameError) {
        throw new Error(emailError || passwordError || fullNameError);
    }

    const { data, error } = await client.auth.signUp({
        email: normalizeEmail(email),
        password,
        options: {
            data: {
                full_name: normalizeSpaces(fullName),
            },
        },
    });

    if (error) throw error;

    // Supabase retorna identities[] vazio quando e-mail já existe e confirmação está ativa
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        throw new Error('Este e-mail já está cadastrado. Tente fazer login ou recupere sua senha.');
    }

    return data;
}

export async function resetPasswordForEmail(email) {
    const client = requireSupabase();
    const emailError = validateEmail(email);

    if (emailError) {
        throw new Error(emailError);
    }

    const { error } = await client.auth.resetPasswordForEmail(normalizeEmail(email), {
        redirectTo: window.location.origin,
    });

    if (error) throw error;
}

export async function signOut() {
    const client = requireSupabase();
    const { error } = await client.auth.signOut();

    if (error) throw error;
}
