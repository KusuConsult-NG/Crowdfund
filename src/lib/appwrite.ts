import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client()
    .setEndpoint("https://fra.cloud.appwrite.io/v1")
    .setProject("694493d0002c86a5e19e");

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const DATABASE_ID = '69449bae002ad7ffd2a2';
export const BUCKET_ID = 'projects_images'; // Replace with your actual bucket ID
export const COLLECTIONS = {
    PROJECTS: 'projects',
    DONATIONS: 'donations',
    UPDATES: 'updates',
    PROFILES: 'profiles',
    SETTINGS: 'settings'
};

export { client, account, databases, storage };
