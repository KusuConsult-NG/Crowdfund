const { Client, Databases, ID, Permission, Role } = require('appwrite');

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('694493d0002c86a5e19e');

const databases = new Databases(client);

const DATABASE_ID = 'churchflow'; // You can change this

async function setupDatabase() {
    try {
        console.log('🚀 Starting database setup...\n');

        // Step 1: Create Database
        console.log('📦 Creating database...');
        let database;
        try {
            database = await databases.create(DATABASE_ID, 'ChurchFlow Database');
            console.log(`✅ Database created: ${database.$id}\n`);
        } catch (error) {
            if (error.code === 409) {
                console.log(`ℹ️  Database already exists: ${DATABASE_ID}\n`);
            } else {
                throw error;
            }
        }

        // Step 2: Create Projects Collection
        console.log('📝 Creating Projects collection...');
        const projectsCollection = await databases.createCollection(
            DATABASE_ID,
            ID.unique(),
            'projects',
            [
                Permission.read(Role.any()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users())
            ]
        );
        console.log(`✅ Projects collection: ${projectsCollection.$id}`);

        // Add attributes to Projects collection
        await databases.createStringAttribute(DATABASE_ID, projectsCollection.$id, 'name', 255, true);
        await databases.createStringAttribute(DATABASE_ID, projectsCollection.$id, 'description', 10000, true);
        await databases.createStringAttribute(DATABASE_ID, projectsCollection.$id, 'category', 50, true);
        await databases.createIntegerAttribute(DATABASE_ID, projectsCollection.$id, 'fundingGoal', true);
        await databases.createIntegerAttribute(DATABASE_ID, projectsCollection.$id, 'raised', true, 0);
        await databases.createStringAttribute(DATABASE_ID, projectsCollection.$id, 'status', 20, true, 'active');
        await databases.createStringAttribute(DATABASE_ID, projectsCollection.$id, 'organizerId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, projectsCollection.$id, 'location', 255, false);
        await databases.createStringAttribute(DATABASE_ID, projectsCollection.$id, 'imageUrl', 500, false);
        await databases.createDatetimeAttribute(DATABASE_ID, projectsCollection.$id, 'endDate', true);
        console.log('  ✓ Added 10 attributes\n');

        // Step 3: Create Donations Collection
        console.log('📝 Creating Donations collection...');
        const donationsCollection = await databases.createCollection(
            DATABASE_ID,
            ID.unique(),
            'donations',
            [
                Permission.read(Role.any()),
                Permission.create(Role.users()),
                Permission.update(Role.users())
            ]
        );
        console.log(`✅ Donations collection: ${donationsCollection.$id}`);

        await databases.createStringAttribute(DATABASE_ID, donationsCollection.$id, 'projectId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, donationsCollection.$id, 'userId', 255, true);
        await databases.createIntegerAttribute(DATABASE_ID, donationsCollection.$id, 'amount', true);
        await databases.createStringAttribute(DATABASE_ID, donationsCollection.$id, 'message', 500, false);
        await databases.createBooleanAttribute(DATABASE_ID, donationsCollection.$id, 'anonymous', true, false);
        await databases.createStringAttribute(DATABASE_ID, donationsCollection.$id, 'rewardTierId', 255, false);
        await databases.createStringAttribute(DATABASE_ID, donationsCollection.$id, 'status', 20, true, 'completed');
        console.log('  ✓ Added 7 attributes\n');

        // Step 4: Create Rewards Collection
        console.log('📝 Creating Rewards collection...');
        const rewardsCollection = await databases.createCollection(
            DATABASE_ID,
            ID.unique(),
            'rewards',
            [
                Permission.read(Role.any()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users())
            ]
        );
        console.log(`✅ Rewards collection: ${rewardsCollection.$id}`);

        await databases.createStringAttribute(DATABASE_ID, rewardsCollection.$id, 'projectId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, rewardsCollection.$id, 'name', 255, true);
        await databases.createIntegerAttribute(DATABASE_ID, rewardsCollection.$id, 'minAmount', true);
        await databases.createStringAttribute(DATABASE_ID, rewardsCollection.$id, 'description', 1000, true);
        await databases.createIntegerAttribute(DATABASE_ID, rewardsCollection.$id, 'quantity', false);
        await databases.createIntegerAttribute(DATABASE_ID, rewardsCollection.$id, 'claimed', true, 0);
        console.log('  ✓ Added 6 attributes\n');

        // Step 5: Create Updates Collection
        console.log('📝 Creating Updates collection...');
        const updatesCollection = await databases.createCollection(
            DATABASE_ID,
            ID.unique(),
            'updates',
            [
                Permission.read(Role.any()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users())
            ]
        );
        console.log(`✅ Updates collection: ${updatesCollection.$id}`);

        await databases.createStringAttribute(DATABASE_ID, updatesCollection.$id, 'projectId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, updatesCollection.$id, 'title', 255, true);
        await databases.createStringAttribute(DATABASE_ID, updatesCollection.$id, 'content', 10000, true);
        console.log('  ✓ Added 3 attributes\n');

        // Summary
        console.log('═══════════════════════════════════════');
        console.log('✅ DATABASE SETUP COMPLETE!');
        console.log('═══════════════════════════════════════\n');
        console.log('📊 Summary:');
        console.log(`Database ID: ${DATABASE_ID}`);
        console.log(`Projects Collection: ${projectsCollection.$id}`);
        console.log(`Donations Collection: ${donationsCollection.$id}`);
        console.log(`Rewards Collection: ${rewardsCollection.$id}`);
        console.log(`Updates Collection: ${updatesCollection.$id}\n`);
        console.log('💡 Next steps:');
        console.log('1. Update src/config/database.ts with these IDs');
        console.log('2. Create service files to interact with collections');
        console.log('3. Connect your UI components to the database\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Full error:', error);
    }
}

// Run setup
setupDatabase();
