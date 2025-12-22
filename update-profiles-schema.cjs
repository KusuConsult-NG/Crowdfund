require('dotenv/config');
const { Client, Databases } = require('node-appwrite');

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('694493d0002c86a5e19e')
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = '69449bae002ad7ffd2a2';

async function updateProfilesSchema() {
    try {
        console.log('🔧 Updating profiles collection schema...\n');

        // Add adminRole attribute to profiles collection
        try {
            await databases.createStringAttribute(
                DATABASE_ID,
                'profiles',
                'adminRole',
                50,
                false // not required
            );
            console.log('✅ Added adminRole attribute to profiles collection\n');
        } catch (error) {
            if (error.code === 409) {
                console.log('ℹ️  adminRole attribute already exists\n');
            } else {
                throw error;
            }
        }

        console.log('✅ Schema update complete!\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Full error:', error);
    }
}

updateProfilesSchema();
