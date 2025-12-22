require('dotenv/config');
const { Client, Databases, Query } = require('node-appwrite');

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('694493d0002c86a5e19e')
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = '69449bae002ad7ffd2a2';

async function migrateExistingUsers() {
    try {
        console.log('🔄 Migrating existing users...\n');

        // Get all user profiles
        const response = await databases.listDocuments(
            DATABASE_ID,
            'profiles',
            [Query.limit(500)]
        );

        console.log(`Found ${response.total} existing user profiles\n`);

        let migratedCount = 0;
        let skippedCount = 0;

        for (const profile of response.documents) {
            try {
                // Skip if already has adminRole or is SuperAdmin
                if (profile.adminRole || profile.role === 'SuperAdmin') {
                    console.log(`ℹ️  Skipping ${profile.name} - already configured`);
                    skippedCount++;
                    continue;
                }

                // Determine the update needed
                let updateData = {};

                if (profile.role === 'Organizer') {
                    // Existing organizers default to Director role
                    updateData = { adminRole: 'Director' };
                    console.log(`✅ Migrated ${profile.name} (${profile.email}) - set as Director`);
                } else if (!profile.role || profile.role === 'Donor') {
                    // Ensure donors have correct role
                    updateData = { role: 'Donor' };
                    console.log(`✅ Confirmed ${profile.name} (${profile.email}) - kept as Donor`);
                }

                if (Object.keys(updateData).length > 0) {
                    await databases.updateDocument(
                        DATABASE_ID,
                        'profiles',
                        profile.$id,
                        updateData
                    );
                    migratedCount++;
                }

            } catch (error) {
                console.error(`❌ Failed to migrate ${profile.name}:`, error.message);
            }
        }

        console.log('\n═══════════════════════════════════════');
        console.log('✅ USER MIGRATION COMPLETE!');
        console.log('═══════════════════════════════════════\n');
        console.log(`📊 Summary:`);
        console.log(`   ✅ Migrated: ${migratedCount} users`);
        console.log(`   ⏭️  Skipped: ${skippedCount} users (already configured)`);
        console.log(`   📁 Total: ${response.total} users\n`);

    } catch (error) {
        console.error('❌ Error during migration:', error.message);
        console.error('Full error:', error);
    }
}

migrateExistingUsers();
