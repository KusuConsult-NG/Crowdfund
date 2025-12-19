import 'dotenv/config';
import { Client, Databases, ID, Permission, Role } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('694493d0002c86a5e19e')
    .setKey(process.env.APPWRITE_API_KEY || 'YOUR_API_KEY');

const databases = new Databases(client);

const DATABASE_ID = '69449bae002ad7ffd2a2';

async function setupDatabase() {
    try {
        console.log('🚀 Starting database setup (using Server SDK)...\n');
        if (!process.env.APPWRITE_API_KEY) {
            console.log('⚠️  Warning: APPWRITE_API_KEY environment variable not set. Using placeholder if provided in script.\n');
        }

        // Step 1: Use Existing Database
        console.log(`📦 Using existing database: ${DATABASE_ID}\n`);

        const collections = [
            {
                id: 'projects',
                name: 'projects',
                permissions: [
                    Permission.read(Role.any()),
                    Permission.create(Role.users()),
                    Permission.update(Role.users()),
                    Permission.delete(Role.users())
                ],
                attributes: [
                    { method: 'createStringAttribute', name: 'name', size: 255, required: true },
                    { method: 'createStringAttribute', name: 'description', size: 10000, required: true },
                    { method: 'createStringAttribute', name: 'category', size: 50, required: true },
                    { method: 'createIntegerAttribute', name: 'fundingGoal', required: true },
                    { method: 'createIntegerAttribute', name: 'raised', required: false, default: 0 },
                    { method: 'createStringAttribute', name: 'status', size: 20, required: false, default: 'active' },
                    { method: 'createStringAttribute', name: 'organizerId', size: 255, required: true },
                    { method: 'createStringAttribute', name: 'location', size: 255, required: false },
                    { method: 'createStringAttribute', name: 'imageUrl', size: 500, required: false },
                    { method: 'createDatetimeAttribute', name: 'endDate', required: true }
                ]
            },
            {
                id: 'donations',
                name: 'donations',
                permissions: [
                    Permission.read(Role.any()),
                    Permission.create(Role.users()),
                    Permission.update(Role.users())
                ],
                attributes: [
                    { method: 'createStringAttribute', name: 'projectId', size: 255, required: true },
                    { method: 'createStringAttribute', name: 'userId', size: 255, required: true },
                    { method: 'createStringAttribute', name: 'userName', size: 255, required: false },
                    { method: 'createIntegerAttribute', name: 'amount', required: true },
                    { method: 'createStringAttribute', name: 'message', size: 500, required: false },
                    { method: 'createBooleanAttribute', name: 'anonymous', required: false, default: false },
                    { method: 'createStringAttribute', name: 'status', size: 20, required: false, default: 'completed' }
                ]
            },
            {
                id: 'updates',
                name: 'updates',
                permissions: [
                    Permission.read(Role.any()),
                    Permission.create(Role.users()),
                    Permission.update(Role.users()),
                    Permission.delete(Role.users())
                ],
                attributes: [
                    { method: 'createStringAttribute', name: 'projectId', size: 255, required: true },
                    { method: 'createStringAttribute', name: 'title', size: 255, required: true },
                    { method: 'createStringAttribute', name: 'content', size: 10000, required: true }
                ]
            },
            {
                id: 'profiles',
                name: 'profiles',
                permissions: [
                    Permission.read(Role.any()),
                    Permission.create(Role.users()),
                    Permission.update(Role.users())
                ],
                attributes: [
                    { method: 'createStringAttribute', name: 'userId', size: 255, required: true },
                    { method: 'createStringAttribute', name: 'name', size: 255, required: true },
                    { method: 'createStringAttribute', name: 'email', size: 255, required: true },
                    { method: 'createStringAttribute', name: 'role', size: 20, required: false, default: 'Donor' },
                    { method: 'createStringAttribute', name: 'status', size: 20, required: false, default: 'Active' }
                ]
            },
            {
                id: 'settings',
                name: 'settings',
                permissions: [
                    Permission.read(Role.any()),
                    Permission.update(Role.users())
                ],
                attributes: [
                    { method: 'createStringAttribute', name: 'key', size: 255, required: true },
                    { method: 'createStringAttribute', name: 'value', size: 5000, required: true }
                ]
            }
        ];

        for (const col of collections) {
            console.log(`📝 Handling ${col.name} collection...`);
            try {
                await databases.createCollection(DATABASE_ID, col.id, col.name, col.permissions);
                console.log(`  ✅ Created collection: ${col.id}`);
            } catch (error: any) {
                if (error.code === 409) {
                    console.log(`  ℹ️  Collection ${col.id} already exists`);
                } else {
                    console.error(`  ❌ Error creating collection ${col.id}:`, error.message);
                    continue;
                }
            }

            for (const attr of col.attributes) {
                try {
                    // @ts-ignore
                    const db = databases as any;
                    const a = attr as any;
                    if (attr.method === 'createStringAttribute') {
                        await db[attr.method](DATABASE_ID, col.id, a.name, a.size, a.required, a.default);
                    } else if (attr.method === 'createIntegerAttribute') {
                        await db[attr.method](DATABASE_ID, col.id, a.name, a.required, a.default, a.min, a.max);
                    } else if (attr.method === 'createBooleanAttribute' || attr.method === 'createDatetimeAttribute') {
                        await db[attr.method](DATABASE_ID, col.id, a.name, a.required, a.default);
                    }
                    console.log(`    ✓ Attribute created: ${attr.name}`);
                } catch (error: any) {
                    if (error.code !== 409) {
                        console.error(`    ❌ Error creating attribute ${attr.name}:`, error.message);
                    }
                }
            }

            // Create Indexes
            const indexDefinitions: { [key: string]: any[] } = {
                projects: [
                    { name: 'idx_status', type: 'key', attributes: ['status'] },
                    { name: 'idx_category', type: 'key', attributes: ['category'] },
                    { name: 'idx_organizer', type: 'key', attributes: ['organizerId'] },
                    { name: 'idx_name_search', type: 'fulltext', attributes: ['name'] },
                    { name: 'idx_funding', type: 'key', attributes: ['fundingGoal'] },
                    { name: 'idx_raised', type: 'key', attributes: ['raised'] },
                    { name: 'idx_created', type: 'key', attributes: ['$createdAt'] }
                ],
                donations: [
                    { name: 'idx_projectId', type: 'key', attributes: ['projectId'] },
                    { name: 'idx_userId', type: 'key', attributes: ['userId'] }
                ]
            };

            if (indexDefinitions[col.id]) {
                for (const idx of indexDefinitions[col.id]) {
                    try {
                        await databases.createIndex(DATABASE_ID, col.id, idx.name, idx.type, idx.attributes);
                        console.log(`    ✓ Index created: ${idx.name}`);
                    } catch (error: any) {
                        if (error.code === 409) {
                            // console.log(`    ℹ️  Index ${idx.name} already exists`);
                        } else {
                            console.error(`    ❌ Error creating index ${idx.name}:`, error.message);
                        }
                    }
                }
            }
            console.log('');
        }

        // Summary
        console.log('═══════════════════════════════════════');
        console.log('✅ DATABASE SETUP COMPLETE!');
        console.log('═══════════════════════════════════════\n');
        console.log('📊 Summary:');
        console.log(`Database ID: ${DATABASE_ID}`);
        collections.forEach(col => {
            console.log(`${col.name.charAt(0).toUpperCase() + col.name.slice(1)} Collection ID: ${col.id}`);
        });
        console.log('\n💡 Next steps:');
        console.log('1. Update src/lib/appwrite.ts with these IDs');
        console.log('2. Create service files to interact with collections');
        console.log('3. Connect your UI components to the database\n');

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        console.error('Full error:', error);
    }
}

// Run setup
setupDatabase();
