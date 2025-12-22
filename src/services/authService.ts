import { account } from '../lib/appwrite';
import { ID, Models } from 'appwrite';
import { userService } from './userService';
import { AdminRole } from '../types';

export const authService = {
    // Create a new user account
    async signup(email: string, password: string, name: string, role: 'Donor' | 'Organizer' | 'SuperAdmin' = 'Donor', adminRole?: AdminRole) {
        try {
            const user = await account.create(ID.unique(), email, password, name);

            // Automatically log in after signup
            await this.login(email, password);

            // Create user profile in database
            await userService.upsertProfile({
                userId: user.$id,
                name,
                email,
                role,
                adminRole: role === 'Organizer' ? adminRole : undefined,
                status: 'Active'
            });

            return user;
        } catch (error: any) {
            console.error('Signup error:', error);
            throw new Error(error.message || 'Failed to create account');
        }
    },

    // Log in an existing user
    async login(email: string, password: string) {
        try {
            return await account.createEmailPasswordSession(email, password);
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(error.message || 'Failed to login');
        }
    },

    // Log out the current user
    async logout() {
        try {
            return await account.deleteSession('current');
        } catch (error: any) {
            console.error('Logout error:', error);
            throw new Error(error.message || 'Failed to logout');
        }
    },

    // Get the currently logged-in user
    async getCurrentUser(): Promise<Models.User<Models.Preferences> | null> {
        try {
            return await account.get();
        } catch (error) {
            return null;
        }
    },

    // Send password recovery email
    async sendPasswordRecovery(email: string) {
        try {
            // Appwrite will send an email with a link to reset password
            // The link should redirect to your reset password page with userId and secret as query params
            const resetUrl = `${window.location.origin}/reset-password`;
            return await account.createRecovery(email, resetUrl);
        } catch (error: any) {
            console.error('Password recovery error:', error);
            throw new Error(error.message || 'Failed to send password recovery email');
        }
    },

    // Complete password recovery with secret token
    async completePasswordRecovery(userId: string, secret: string, password: string) {
        try {
            return await account.updateRecovery(userId, secret, password);
        } catch (error: any) {
            console.error('Password reset error:', error);
            throw new Error(error.message || 'Failed to reset password');
        }
    }
};
