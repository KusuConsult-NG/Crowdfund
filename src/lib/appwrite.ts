import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
export const BUCKET_ID = import.meta.env.VITE_BUCKET_ID;
export const COLLECTIONS = {
    PROJECTS: 'projects',
    DONATIONS: 'donations',
    UPDATES: 'updates',
    PROFILES: 'profiles',
    SETTINGS: 'settings'
};

export { client, account, databases, storage };
