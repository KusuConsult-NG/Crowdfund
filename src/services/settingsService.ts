import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { Query } from 'appwrite';

export const settingsService = {
    async getSettings() {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.SETTINGS
        );

        // Convert array of {key, value} to an object
        const settings: Record<string, string> = {};
        response.documents.forEach((doc: any) => {
            settings[doc.key] = doc.value;
        });
        return settings;
    },

    async updateSetting(key: string, value: string) {
        // Find if setting already exists
        const existing = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.SETTINGS,
            [Query.equal('key', key)]
        );

        if (existing.total > 0) {
            return await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.SETTINGS,
                existing.documents[0].$id,
                { value }
            );
        } else {
            return await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.SETTINGS,
                'unique()',
                { key, value }
            );
        }
    }
};
