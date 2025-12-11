import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, DbEmployer } from '@/lib/supabase';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    employer: DbEmployer | null;
    isLoading: boolean;
    signUp: (email: string, password: string, name: string, whatsapp: string) => Promise<{ error: Error | null }>;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [employer, setEmployer] = useState<DbEmployer | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchEmployer(session.user.id);
            }
            setIsLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    await fetchEmployer(session.user.id);
                } else {
                    setEmployer(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const fetchEmployer = async (userId: string) => {
        const { data, error } = await supabase
            .from('employers')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (!error && data) {
            setEmployer(data);
        }
    };

    const signUp = async (email: string, password: string, name: string, whatsapp: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            // Create employer profile
            if (data.user) {
                const { error: employerError } = await supabase
                    .from('employers')
                    .insert({
                        user_id: data.user.id,
                        name,
                        email,
                        whatsapp: '55' + whatsapp.replace(/\D/g, ''),
                    });

                if (employerError) throw employerError;
            }

            return { error: null };
        } catch (error) {
            return { error: error as Error };
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            return { error: null };
        } catch (error) {
            return { error: error as Error };
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setEmployer(null);
    };

    const resetPassword = async (email: string) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;
            return { error: null };
        } catch (error) {
            return { error: error as Error };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                employer,
                isLoading,
                signUp,
                signIn,
                signOut,
                resetPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
