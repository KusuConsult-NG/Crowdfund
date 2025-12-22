require('dotenv/config');
const { Client, Databases } = require('node-appwrite');

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('694493d0002c86a5e19e')
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = '69449bae002ad7ffd2a2';

async function checkPermissions() {
    try {
        console.log('🔍 Checking collection permissions...\n');

        const collections = ['projects', 'donations', 'updates', 'profiles', 'settings'];

        for (const collectionId of collections) {
            try {
                const collection = await databases.getCollection(DATABASE_ID, collectionId);
                console.log(`\n📁 Collection: ${collection.name} (${collection.$id})`);
                console.log(`   Permissions: ${JSON.stringify(collection.$permissions, null, 2)}`);

                // Try to list documents
                try {
                    const docs = await databases.listDocuments(DATABASE_ID, collectionId, []);
                    console.log(`   ✅ Can list documents (${docs.total} total)`);
                } catch (err) {
                    console.log(`   ❌ Cannot list documents: ${err.message}`);
                }
            } catch (err) {
                console.log(`\n❌ Collection ${collectionId} not found or error: ${err.message}`);
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkPermissions();
