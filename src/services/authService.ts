import { account } from '../lib/appwrite';
import { ID, Models } from 'appwrite';
import { userService } from './userService';
import { AdminRole } from '../types';

/**
 * Authentication service for handling user authentication operations
 * Uses Appwrite as the backend authentication provider
 */
export const authService = {
    /**
     * Register a new user account
     * @param email - User's email address
     * @param password - User's password
     * @param name - User's full name
     * @param role - User role (Donor, Organizer, or SuperAdmin)
     * @param adminRole - Admin role if user is an Organizer
     */
    async signup(email: string, password: string, name: string, role: 'Donor' | 'Organizer' | 'SuperAdmin' = 'Donor', adminRole?: AdminRole) {
        try {
            // Create the user account in Appwrite
            const user = await account.create(ID.unique(), email, password, name);

            // Auto-login after successful registration for better UX
            await this.login(email, password);

            // Store additional profile data in our database
            // This includes role information not stored in Appwrite auth
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
            // Return user-friendly error message
            throw new Error(error.message || 'Failed to create account');
        }
    },

    /**
     * Authenticate an existing user
     * Creates a new session for the user
     */
    async login(email: string, password: string) {
        try {
            return await account.createEmailPasswordSession(email, password);
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(error.message || 'Failed to login');
        }
    },

    /**
     * Sign out the current user
     * Deletes the active session
     */
    async logout() {
        try {
            return await account.deleteSession('current');
        } catch (error: any) {
            console.error('Logout error:', error);
            throw new Error(error.message || 'Failed to logout');
        }
    },

    /**
     * Get current authenticated user
     * Returns null if no user is logged in
     */
    async getCurrentUser(): Promise<Models.User<Models.Preferences> | null> {
        try {
            return await account.get();
        } catch (error) {
            // User not logged in - return null instead of throwing
            return null;
        }
    },

    /**
     * Initiate password reset process
     * Sends an email with a recovery link to the user
     * @param email - User's registered email address
     */
    async sendPasswordRecovery(email: string) {
        try {
            // Generate the URL where user will be redirected after clicking email link
            // Appwrite will append userId and secret as query params
            const resetUrl = `${window.location.origin}/reset-password`;

            return await account.createRecovery(email, resetUrl);
        } catch (error: any) {
            console.error('Password recovery error:', error);
            throw new Error(error.message || 'Failed to send password recovery email');
        }
    },

    /**
     * Complete the password reset process
     * Validates the secret token and updates the password
     * @param userId - The user's ID from the email link
     * @param secret - The secret token from the email link
     * @param password - The new password
     */
    async completePasswordRecovery(userId: string, secret: string, password: string) {
        try {
            return await account.updateRecovery(userId, secret, password);
        } catch (error: any) {
            console.error('Password reset error:', error);
            throw new Error(error.message || 'Failed to reset password');
        }
    }
};
