import { requireSupabase } from '@/lib/supabase/client';
import {
    normalizeEmail,
    validateEmail,
} from '@/utils/validation';

export const EBOOK_FILE_PATH = '/assets/ebooks/ebook-teste.pdf';

export async function sendEbookLead({ email }) {
    const normalizedEmail = normalizeEmail(email);
    const emailError = validateEmail(normalizedEmail);

    if (emailError) {
        throw new Error(emailError);
    }

    const client = requireSupabase();
    const ebookUrl = new URL(EBOOK_FILE_PATH, window.location.origin).toString();
    const { data, error } = await client.functions.invoke('send-ebook', {
        body: {
            email: normalizedEmail,
            source: 'ebook_dialog',
            ebookPath: EBOOK_FILE_PATH,
            ebookUrl,
        },
    });

    if (error) {
        const errorDetails = await error.context?.json?.().catch(() => null);

        if (errorDetails?.error) {
            throw new Error(errorDetails.error);
        }

        throw new Error(error.message || 'Não foi possível enviar o e-book.');
    }

    if (data?.error) {
        throw new Error(data.error);
    }

    return data;
}
