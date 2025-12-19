import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID, Query } from 'appwrite';
import { Donation, AppwriteDocument } from '../types';

export const donationService = {
    // Get donations for a specific project
    async getProjectDonations(projectId: string, limit = 50) {
        return await databases.listDocuments<Donation & { $id: string }>(
            DATABASE_ID,
            COLLECTIONS.DONATIONS,
            [
                Query.equal('projectId', projectId),
                Query.orderDesc('$createdAt'),
                Query.limit(limit)
            ]
        );
    },

    // Get donations by a specific user
    async getUserDonations(userId: string, limit = 50) {
        return await databases.listDocuments<Donation & { $id: string }>(
            DATABASE_ID,
            COLLECTIONS.DONATIONS,
            [
                Query.equal('userId', userId),
                Query.orderDesc('$createdAt'),
                Query.limit(limit)
            ]
        );
    },

    // Get donations for a list of projects
    async getDonationsByProjects(projectIds: string[], limit = 50) {
        if (projectIds.length === 0) return { documents: [], total: 0 };
        return await databases.listDocuments<Donation & { $id: string }>(
            DATABASE_ID,
            COLLECTIONS.DONATIONS,
            [
                Query.equal('projectId', projectIds),
                Query.orderDesc('$createdAt'),
                Query.limit(limit)
            ]
        );
    },

    async createDonation(data: Omit<Donation, keyof AppwriteDocument | 'status'>) {
        return await databases.createDocument<Donation & { $id: string }>(
            DATABASE_ID,
            COLLECTIONS.DONATIONS,
            ID.unique(),
            {
                ...data,
                status: 'completed'
            } as any
        );
    }
};
