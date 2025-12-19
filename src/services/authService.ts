import { account } from '../lib/appwrite';
import { ID, Models } from 'appwrite';
import { userService } from './userService';

export const authService = {
    // Create a new user account
    async signup(email: string, password: string, name: string) {
        try {
            const user = await account.create(ID.unique(), email, password, name);

            // Automatically log in after signup
            await this.login(email, password);

            // Create user profile in database
            await userService.upsertProfile({
                userId: user.$id,
                name,
                email,
                role: 'Donor',
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
    }
};
