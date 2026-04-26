import {
    useEffect,
    useState,
} from 'react';
import PropTypes from 'prop-types';
import { supabase, supabaseConfigurationMessage } from '@/lib/supabase/client';
import {
    getSession,
    resetPasswordForEmail,
    signInWithPassword,
    signOut as signOutRequest,
    signUpWithPassword,
} from '@/services/supabase/authService';
import { getProfile } from '@/services/supabase/profileService';
import { AuthContext } from '@/contexts/AuthContextBase';

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState('');
    const [configError, setConfigError] = useState('');

    useEffect(() => {
        let isMounted = true;

        async function bootstrapAuth() {
            if (!supabase) {
                setConfigError(supabaseConfigurationMessage);
                setIsLoading(false);
                return;
            }

            try {
                const nextSession = await getSession();
                if (!isMounted) return;

                setSession(nextSession);

                if (nextSession?.user) {
                    const nextProfile = await getProfile(nextSession.user.id);
                    if (isMounted) {
                        setProfile(nextProfile);
                    }
                }
            } catch (error) {
                if (!isMounted) return;
                setAuthError(error.message || 'Nao foi possivel carregar a sessao.');
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        bootstrapAuth();

        const subscription = supabase?.auth.onAuthStateChange((_event, nextSession) => {
            setSession(nextSession);

            if (!nextSession?.user) {
                setProfile(null);
                return;
            }

            setTimeout(async () => {
                try {
                    const nextProfile = await getProfile(nextSession.user.id);
                    if (isMounted) {
                        setProfile(nextProfile);
                    }
                } catch (error) {
                    if (isMounted) {
                        setAuthError(error.message || 'Nao foi possivel sincronizar o perfil.');
                    }
                }
            }, 0);
        });

        return () => {
            isMounted = false;
            subscription?.data.subscription.unsubscribe();
        };
    }, []);

    const value = {
        accessType: profile?.access_type || 'usuario',
        session,
        user: session?.user || null,
        profile,
        isLoading,
        authError,
        configError,
        isAdmin: profile?.access_type === 'administrador',
        isAuthenticated: Boolean(session?.user),
        signIn: signInWithPassword,
        signUp: signUpWithPassword,
        resetPassword: resetPasswordForEmail,
        signOut: signOutRequest,
        clearAuthError: () => setAuthError(''),
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
