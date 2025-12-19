import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID, Query } from 'appwrite';
import { Update, AppwriteDocument } from '../types';

export const updateService = {
    // Get updates for a project
    async getProjectUpdates(projectId: string, limit = 50) {
        return await databases.listDocuments<Update & { $id: string }>(
            DATABASE_ID,
            COLLECTIONS.UPDATES,
            [
                Query.equal('projectId', projectId),
                Query.orderDesc('$createdAt'),
                Query.limit(limit)
            ]
        );
    },

    // Get all updates globally (for moderation)
    async getAllUpdates(limit = 50) {
        return await databases.listDocuments<Update & { $id: string }>(
            DATABASE_ID,
            COLLECTIONS.UPDATES,
            [
                Query.orderDesc('$createdAt'),
                Query.limit(limit)
            ]
        );
    },

    // Create a new update
    async createUpdate(data: Omit<Update, keyof AppwriteDocument>) {
        return await databases.createDocument<Update & { $id: string }>(
            DATABASE_ID,
            COLLECTIONS.UPDATES,
            ID.unique(),
            data
        );
    },

    // Update an existing update post
    async updateUpdate(updateId: string, data: Partial<Omit<Update, '$id' | '$createdAt'>>) {
        return await databases.updateDocument<Update & { $id: string }>(
            DATABASE_ID,
            COLLECTIONS.UPDATES,
            updateId,
            data
        );
    },

    // Delete an update
    async deleteUpdate(updateId: string) {
        return await databases.deleteDocument(
            DATABASE_ID,
            COLLECTIONS.UPDATES,
            updateId
        );
    }
};
