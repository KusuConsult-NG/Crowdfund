require('dotenv/config');
const { Client, Databases, Permission, Role } = require('node-appwrite');

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('694493d0002c86a5e19e')
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = '69449bae002ad7ffd2a2';

async function fixProjectsPermissions() {
    try {
        console.log('🔧 Fixing projects collection permissions...\n');

        // Update the projects collection with proper permissions
        const permissions = [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
        ];

        await databases.updateCollection(
            DATABASE_ID,
            'projects',
            'projects',
            permissions
        );

        console.log('✅ Projects collection permissions updated successfully!\n');
        console.log('Permissions set:');
        console.log('  - Read: Any (allows public access)');
        console.log('  - Create: Users (logged-in users only)');
        console.log('  - Update: Users (logged-in users only)');
        console.log('  - Delete: Users (logged-in users only)\n');

        // Verify the update
        const collection = await databases.getCollection(DATABASE_ID, 'projects');
        console.log('Verified permissions:', collection.$permissions);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Full error:', error);
    }
}

fixProjectsPermissions();
