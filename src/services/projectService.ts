import { databases, storage, DATABASE_ID, COLLECTIONS, BUCKET_ID } from '../lib/appwrite';
import { ID, Query } from 'appwrite';
import { Project, AppwriteDocument } from '../types';

export const projectService = {
    // Get all projects with filtering and search
    async getProjects(limit = 10, offset = 0, category?: string, search?: string, sort: 'newest' | 'goal_high' | 'goal_low' | 'raised' = 'newest') {
        const queries = [
            Query.limit(limit),
            Query.offset(offset)
        ];

        // Handle Status (only show active projects by default for discovery)
        queries.push(Query.equal('status', 'active'));

        // Handle Category
        if (category && category !== 'all' && category !== 'All') {
            queries.push(Query.equal('category', category));
        }

        // Handle Search
        if (search) {
            queries.push(Query.search('name', search));
        }

        // Handle Sorting
        if (sort === 'newest') {
            queries.push(Query.orderDesc('$createdAt'));
        } else if (sort === 'goal_high') {
            queries.push(Query.orderDesc('fundingGoal'));
        } else if (sort === 'goal_low') {
            queries.push(Query.orderAsc('fundingGoal'));
        } else if (sort === 'raised') {
            queries.push(Query.orderDesc('raised'));
        }

        return await databases.listDocuments<Project & { $id: string }>(
            DATABASE_ID,
            COLLECTIONS.PROJECTS,
            queries
        );
    },

    // Get projects by organizer
    async getProjectsByOrganizer(organizerId: string, limit = 50) {
        return await databases.listDocuments<Project & { $id: string }>(
            DATABASE_ID,
            COLLECTIONS.PROJECTS,
            [
                Query.equal('organizerId', organizerId),
                Query.orderDesc('$createdAt'),
                Query.limit(limit)
            ]
        );
    },

    // Get all projects for admin/superadmin (no owner filter)
    async getAllProjectsForAdmin(limit = 100) {
        return await databases.listDocuments<Project & { $id: string }>(
            DATABASE_ID,
            COLLECTIONS.PROJECTS,
            [
                Query.orderDesc('$createdAt'),
                Query.limit(limit)
            ]
        );
    },

    // Get a project by ID
    async getProject(projectId: string) {
        return await databases.getDocument<Project & { $id: string }>(
            DATABASE_ID,
            COLLECTIONS.PROJECTS,
            projectId
        );
    },

    // Create a new project
    async createProject(data: Omit<Project, keyof AppwriteDocument | 'raised'>, imageFile?: File) {
        let imageUrl = data.imageUrl;

        if (imageFile) {
            const uploadedFile = await this.uploadImage(imageFile);
            imageUrl = this.getFilePreview(uploadedFile.$id).toString();
        }

        return await databases.createDocument<Project & { $id: string }>(
            DATABASE_ID,
            COLLECTIONS.PROJECTS,
            ID.unique(),
            {
                ...data,
                imageUrl,
                raised: 0,
                status: 'pending'
            }
        );
    },

    // Upload an image to Appwrite Storage
    async uploadImage(file: File) {
        return await storage.createFile(
            BUCKET_ID,
            ID.unique(),
            file
        );
    },

    // Get a preview URL for a file
    getFilePreview(fileId: string) {
        return storage.getFilePreview(BUCKET_ID, fileId);
    },

    // Update a project
    async updateProject(projectId: string, data: Partial<Omit<Project, '$id' | '$createdAt' | '$updatedAt'>>) {
        return await databases.updateDocument<Project & { $id: string }>(
            DATABASE_ID,
            COLLECTIONS.PROJECTS,
            projectId,
            data
        );
    },

    // Delete a project
    async deleteProject(projectId: string) {
        return await databases.deleteDocument(
            DATABASE_ID,
            COLLECTIONS.PROJECTS,
            projectId
        );
    },

    // Increment raised amount
    async incrementRaisedAmount(projectId: string, amount: number) {
        const project = await this.getProject(projectId);
        const newRaised = (project.raised || 0) + amount;
        return await this.updateProject(projectId, { raised: newRaised });
    }
};
