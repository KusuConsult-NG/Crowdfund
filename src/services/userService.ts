import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID, Query } from 'appwrite';
import { UserProfile, AppwriteDocument } from '../types';

export const userService = {
    // Get all user profiles (Super Admin only)
    async listUsers(limit = 100) {
        return await databases.listDocuments<UserProfile & { $id: string }>(
            DATABASE_ID,
            COLLECTIONS.PROFILES,
            [
                Query.limit(limit),
                Query.orderDesc('$createdAt')
            ]
        );
    },

    // Search users by name or email
    async searchUsers(term: string) {
        return await databases.listDocuments<UserProfile & { $id: string }>(
            DATABASE_ID,
            COLLECTIONS.PROFILES,
            [
                Query.or([
                    Query.contains('name', term),
                    Query.contains('email', term)
                ])
            ]
        );
    },

    // Get a specific user profile
    async getUserProfile(userId: string) {
        const response = await databases.listDocuments<UserProfile & { $id: string }>(
            DATABASE_ID,
            COLLECTIONS.PROFILES,
            [Query.equal('userId', userId)]
        );
        return response.documents[0] || null;
    },

    // Create or update a user profile
    async upsertProfile(data: Omit<UserProfile, keyof AppwriteDocument>) {
        const existing = await this.getUserProfile(data.userId);

        if (existing) {
            return await databases.updateDocument<UserProfile & { $id: string }>(
                DATABASE_ID,
                COLLECTIONS.PROFILES,
                existing.$id,
                data
            );
        } else {
            return await databases.createDocument<UserProfile & { $id: string }>(
                DATABASE_ID,
                COLLECTIONS.PROFILES,
                ID.unique(),
                data
            );
        }
    },

    // Update user role or status
    async updateUser(profileId: string, data: Partial<Pick<UserProfile, 'role' | 'status'>>) {
        return await databases.updateDocument<UserProfile & { $id: string }>(
            DATABASE_ID,
            COLLECTIONS.PROFILES,
            profileId,
            data
        );
    }
};
