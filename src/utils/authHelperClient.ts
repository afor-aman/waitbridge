import { authClient } from '@/lib/auth-client'; //import the auth client

export const signUp = async (email: string, password: string, name: string, image: string) => {
    try {
        const { data, error } = await authClient.signUp.email({
            email,
            password,
            name,
            callbackURL: '/login',
        });
        return { data, error };
    } catch (error) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { data: null, error: error as any };
    }
};

export const signIn = async (email: string, password: string, rememberMe: boolean = true) => {
    try {
        const { data, error } = await authClient.signIn.email({
            fetchOptions: {
                onError: async (context) => {
                    const { response } = context;
                    if (response.status === 429) {
                        const retryAfter = response.headers.get('X-Retry-After');
                        throw {
                            type: 'rate_limit',
                            retryAfter,
                        };
                    }
                },
            },
            email,
            password,
            rememberMe,
            callbackURL: '/dashboard',
        });
        return { data, error };
    } catch (error: any) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (error.type === 'rate_limit') {
            return {
                data: null,
                error: { message: `Rate limit exceeded. Retry after ${error.retryAfter} seconds` },
            };
        }
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { data: null, error: error as any };
    }
};

export const signOut = async () => {
    try {
        const { data, error } = await authClient.signOut();
        return { data, error };
    } catch (error) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { data: null, error: error as any };
    }
};
