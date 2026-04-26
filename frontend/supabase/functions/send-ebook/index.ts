import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const defaultEbookPath = '/assets/ebooks/ebook-teste.pdf';

function jsonResponse(body: Record<string, unknown>, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
        },
    });
}

function normalizeEmail(value: unknown) {
    return String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function normalizeSource(value: unknown) {
    const source = String(value || '').trim().replace(/\s+/g, ' ');
    return source.slice(0, 80) || 'ebook_dialog';
}

function validateEmail(email: string) {
    if (!email) return 'Informe o e-mail.';
    if (email.length > 254) return 'E-mail deve ter no máximo 254 caracteres.';
    if (!emailPattern.test(email)) return 'Informe um e-mail válido.';
    return '';
}

async function getAuthenticatedUser(req: Request) {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const authorization = req.headers.get('Authorization');

    if (!supabaseUrl || !supabaseAnonKey || !authorization) return null;

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: {
                Authorization: authorization,
            },
        },
    });
    const { data, error } = await userClient.auth.getUser();

    if (error) return null;
    return data.user;
}

async function loadAttachment(ebookUrl: string) {
    try {
        const response = await fetch(ebookUrl);

        if (!response.ok) return null;

        const bytes = new Uint8Array(await response.arrayBuffer());
        let binary = '';

        for (const byte of bytes) {
            binary += String.fromCharCode(byte);
        }

        return {
            filename: 'ebook-teste.pdf',
            content: btoa(binary),
        };
    } catch (_error) {
        return null;
    }
}

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    if (req.method !== 'POST') {
        return jsonResponse({ error: 'Metodo nao permitido.' }, 405);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
        return jsonResponse({ error: 'Supabase nao esta configurado para a funcao.' }, 500);
    }

    let payload: Record<string, unknown>;

    try {
        payload = await req.json();
    } catch (_error) {
        return jsonResponse({ error: 'JSON invalido.' }, 400);
    }

    const email = normalizeEmail(payload.email);
    const source = normalizeSource(payload.source);
    const ebookPath = String(payload.ebookPath || defaultEbookPath);
    const ebookUrl = String(payload.ebookUrl || Deno.env.get('EBOOK_PUBLIC_URL') || '');
    const emailError = validateEmail(email);

    if (emailError) {
        return jsonResponse({ error: emailError }, 400);
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const user = await getAuthenticatedUser(req);
    const { data: lead, error: leadError } = await adminClient
        .from('ebook_leads')
        .insert({
            email,
            user_id: user?.id || null,
            source,
            ebook_path: ebookPath,
            delivery_status: 'pending',
        })
        .select('id')
        .single();

    if (leadError) {
        return jsonResponse({ error: leadError.message }, 500);
    }

    if (!resendApiKey) {
        const message = 'Configure RESEND_API_KEY nos secrets da Edge Function para habilitar o envio.';
        await adminClient
            .from('ebook_leads')
            .update({
                delivery_status: 'failed',
                error_message: message,
                updated_at: new Date().toISOString(),
            })
            .eq('id', lead.id);

        return jsonResponse({ error: message, leadId: lead.id }, 500);
    }

    if (!ebookUrl) {
        const message = 'Configure EBOOK_PUBLIC_URL ou envie ebookUrl no corpo da requisicao.';
        await adminClient
            .from('ebook_leads')
            .update({
                delivery_status: 'failed',
                error_message: message,
                updated_at: new Date().toISOString(),
            })
            .eq('id', lead.id);

        return jsonResponse({ error: message, leadId: lead.id }, 500);
    }

    const fromEmail = Deno.env.get('EBOOK_FROM_EMAIL') || 'Livro de Receitas <onboarding@resend.dev>';
    const attachment = await loadAttachment(ebookUrl);
    const emailBody: Record<string, unknown> = {
        from: fromEmail,
        to: [email],
        subject: 'Seu e-book do Livro de Receitas',
        html: `
            <p>Olá!</p>
            <p>Segue o e-book solicitado no Livro de Receitas.</p>
            <p><a href="${ebookUrl}">Clique aqui para acessar o e-book</a>.</p>
        `,
    };

    if (attachment) {
        emailBody.attachments = [attachment];
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailBody),
    });
    const resendData = await resendResponse.json().catch(() => ({}));

    if (!resendResponse.ok) {
        const message = String(resendData.message || resendData.error || 'Nao foi possivel enviar o e-mail.');
        await adminClient
            .from('ebook_leads')
            .update({
                delivery_status: 'failed',
                error_message: message,
                updated_at: new Date().toISOString(),
            })
            .eq('id', lead.id);

        return jsonResponse({ error: message, leadId: lead.id }, 502);
    }

    await adminClient
        .from('ebook_leads')
        .update({
            delivery_status: 'sent',
            provider_message_id: String(resendData.id || ''),
            sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('id', lead.id);

    return jsonResponse({
        leadId: lead.id,
        deliveryStatus: 'sent',
        providerMessageId: resendData.id || null,
    });
});
