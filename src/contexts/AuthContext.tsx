import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { Models } from 'appwrite';
import { UserProfile, AdminRole } from '../types';

interface AuthContextType {
    user: Models.User<Models.Preferences> | null;
    userProfile: UserProfile | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string, role?: 'Donor' | 'Organizer', adminRole?: AdminRole) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    isAdmin: () => boolean;
    isDonor: () => boolean;
    isSuperAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);

            // Fetch user profile if logged in
            if (currentUser) {
                const profile = await userService.getUserProfile(currentUser.$id);
                setUserProfile(profile);
            } else {
                setUserProfile(null);
            }
        } catch (error) {
            setUser(null);
            setUserProfile(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const signup = async (email: string, password: string, name: string, role: 'Donor' | 'Organizer' = 'Donor', adminRole?: AdminRole) => {
        try {
            await authService.signup(email, password, name, role, adminRole);
            await checkAuth();
        } catch (error: any) {
            throw error;
        }
    };

    const login = async (email: string, password: string) => {
        try {
            await authService.login(email, password);
            await checkAuth();
        } catch (error: any) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            setUserProfile(null);
        } catch (error: any) {
            throw error;
        }
    };

    const isAdmin = () => userProfile?.role === 'Organizer';
    const isDonor = () => userProfile?.role === 'Donor';
    const isSuperAdmin = () => userProfile?.role === 'SuperAdmin';

    return (
        <AuthContext.Provider value={{ user, userProfile, loading, login, signup, logout, checkAuth, isAdmin, isDonor, isSuperAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
