export interface AppwriteDocument {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    $collectionId: string;
    $databaseId: string;
    $permissions: string[];
    $sequence: number;
}

export interface Project extends AppwriteDocument {
    name: string;
    description: string;
    category: string;
    fundingGoal: number;
    raised: number;
    status: 'active' | 'completed' | 'pending' | 'rejected';
    organizerId: string;
    location?: string;
    imageUrl?: string;
    endDate: string;
}

export interface Donation extends AppwriteDocument {
    projectId: string;
    userId: string;
    userName: string;
    amount: number;
    message?: string;
    anonymous: boolean;
    status: 'pending' | 'completed' | 'failed';
}

export interface Update extends AppwriteDocument {
    projectId: string;
    title: string;
    content: string;
}

export interface UserProfile extends AppwriteDocument {
    userId: string;
    name: string;
    email: string;
    role: 'Donor' | 'Organizer' | 'SuperAdmin';
    status: 'Active' | 'Inactive';
}
