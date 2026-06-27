import { tokenManager } from "../lib/auth";
import { client } from "./clients";

// Utility function to sanitize phone number (remove + and any non-digit characters)
const sanitizePhone = (phone: string): string => {
    return phone.replace(/\D/g, '');
};

//Auth API functions
export const authApi = {
    //login
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const sanitizedCredentials = {
            ...credentials,
            phone: credentials.phone ? sanitizePhone(credentials.phone) : undefined
        };
        const { data } = await client.post('/auth/login', sanitizedCredentials);
        return data;
    },

    //sighup
    signup: async (userData: SignupRequest): Promise<AuthResponse> => {
        const sanitizedUserData = {
            ...userData,
            phone: userData.phone ? sanitizePhone(userData.phone) : undefined
        };
        const { data } = await client.post('/auth/signup', sanitizedUserData);
        return data;
    },

    //check email
    checkEmailExists: async (email: string): Promise<{ exists: boolean }> => {
        const { data } = await client.post('/auth/check-email', { email });
        return data.result || data;
    },
    //logout

    logout: async (): Promise<{ message: string }> => {
        const { data } = await client.post('/auth/logout');
        return data;
    },

    getCurrentUser: async (): Promise<AuthResponse> => {
        const { data } = await client.get('/auth/me', { headers: { "Authorization": `Bearer ${tokenManager.getToken()}` } });
        return data;
    },
};

// AUTH TYPES
type LoginRequest = {
    email: string;
    password: string;
    phone?: string
};

type SignupRequest = {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    roleType?: string;
};

export type User = {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    roleType?: string;
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    roles: Array<{
        id: string,
        name: string,
        category: string,
        description: string,
        userRoles: Array<{
            id: string,
            name: string,
            description: string
        }>;
        permissions: Array<{
            id: string,
            name: string,
            description: string,
        }>;

    }>;

};

export interface AuthResponse {
    success: boolean;
    message: string;
    result: {
        user: User;
        accessToken?: string;
        refreshToken?: string;
        token?: string;
    };
    statusCode: number;
}

