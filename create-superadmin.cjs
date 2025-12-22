const { Client, Databases, Query } = require('node-appwrite');
require('dotenv').config();

const DATABASE_ID = '69449bae002ad7ffd2a2';
const PROFILE_COLLECTION_ID = 'profiles';

const client = new Client()
    .setEndpoint("https://fra.cloud.appwrite.io/v1")
    .setProject("694493d0002c86a5e19e")
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function promoteToSuperAdmin(email) {
    try {
        console.log(`Searching for user profile with email: ${email}`);
        const profiles = await databases.listDocuments(
            DATABASE_ID,
            PROFILE_COLLECTION_ID,
            [Query.equal('email', email)]
        );

        if (profiles.total === 0) {
            console.error('Profile not found for email:', email);
            process.exit(1);
        }

        const profileId = profiles.documents[0].$id;
        console.log(`Found profile: ${profileId}. Promoting to SuperAdmin...`);

        await databases.updateDocument(
            DATABASE_ID,
            PROFILE_COLLECTION_ID,
            profileId,
            {
                role: 'SuperAdmin',
                adminRole: 'Director' // keeping an adminRole for consistency if needed
            }
        );

        console.log('Successfully promoted user to SuperAdmin!');
    } catch (error) {
        console.error('Error promoting user:', error);
        process.exit(1);
    }
}

const email = process.argv[2];
if (!email) {
    console.error('Usage: node create-superadmin.cjs <email>');
    process.exit(1);
}

promoteToSuperAdmin(email);
