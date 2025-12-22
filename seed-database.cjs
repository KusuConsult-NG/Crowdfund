require('dotenv/config');
const { Client, Databases, ID } = require('node-appwrite');

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('694493d0002c86a5e19e')
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = '69449bae002ad7ffd2a2';

// Sample projects data
const sampleProjects = [
    {
        name: 'New Church Building Fund',
        description: 'We are raising funds to construct a new church building that will accommodate our growing congregation. The new facility will include a main sanctuary, children\'s area, and community hall for fellowship activities.',
        category: 'building',
        fundingGoal: 500000,
        raised: 175000,
        status: 'active',
        organizerId: 'org_001',
        location: 'Lagos, Nigeria',
        imageUrl: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800',
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days from now
    },
    {
        name: 'Community Outreach Program',
        description: 'Supporting local families in need through food distribution, clothing drives, and essential supplies. Our goal is to reach 200 families in the community this quarter.',
        category: 'outreach',
        fundingGoal: 50000,
        raised: 38500,
        status: 'active',
        organizerId: 'org_002',
        location: 'Abuja, Nigeria',
        imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString() // 45 days from now
    },
    {
        name: 'Mission Trip to Northern Region',
        description: 'We are organizing a mission trip to spread the gospel and provide humanitarian aid to remote communities. The trip will include medical outreach, educational programs, and evangelism.',
        category: 'mission',
        fundingGoal: 120000,
        raised: 95000,
        status: 'active',
        organizerId: 'org_003',
        location: 'Kaduna, Nigeria',
        imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() // 60 days from now
    },
    {
        name: 'Church Sound System Upgrade',
        description: 'Upgrading our church sound system and audiovisual equipment to enhance worship experience and enable better live streaming capabilities for online congregation.',
        category: 'equipment',
        fundingGoal: 75000,
        raised: 45000,
        status: 'active',
        organizerId: 'org_001',
        location: 'Port Harcourt, Nigeria',
        imageUrl: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800',
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    },
    {
        name: 'Youth Leadership Training Program',
        description: 'Empowering the next generation of church leaders through comprehensive training in biblical studies, leadership skills, and ministry development. Program includes workshops, mentorship, and practical ministry experience.',
        category: 'education',
        fundingGoal: 35000,
        raised: 28000,
        status: 'active',
        organizerId: 'org_004',
        location: 'Enugu, Nigeria',
        imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800',
        endDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString() // 75 days from now
    },
    {
        name: 'Children\'s Ministry Expansion',
        description: 'Creating a vibrant and safe environment for children to learn about God. Funds will be used for educational materials, toys, furniture, and training for volunteers.',
        category: 'other',
        fundingGoal: 25000,
        raised: 18500,
        status: 'active',
        organizerId: 'org_002',
        location: 'Ibadan, Nigeria',
        imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800',
        endDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString() // 50 days from now
    },
    {
        name: 'Church Roof Repair',
        description: 'Emergency repairs needed for our church roof due to recent storm damage. The repairs will ensure the safety and comfort of our congregation during services.',
        category: 'building',
        fundingGoal: 80000,
        raised: 72000,
        status: 'active',
        organizerId: 'org_003',
        location: 'Benin City, Nigeria',
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString() // 20 days from now
    },
    {
        name: 'Pastoral Training Conference',
        description: 'Annual conference bringing together pastors and church leaders from across the region for intensive training, fellowship, and spiritual renewal. Includes accommodation, meals, and training materials.',
        category: 'education',
        fundingGoal: 60000,
        raised: 15000,
        status: 'active',
        organizerId: 'org_004',
        location: 'Jos, Nigeria',
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        endDate: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000).toISOString() // 100 days from now
    },
    {
        name: 'Medical Mission Outreach',
        description: 'Providing free medical care and health education to underserved communities. Our medical team will offer consultations, medications, and health screenings to those in need.',
        category: 'outreach',
        fundingGoal: 90000,
        raised: 54000,
        status: 'active',
        organizerId: 'org_001',
        location: 'Calabar, Nigeria',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
        endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString() // 40 days from now
    },
    {
        name: 'Bible Distribution Campaign',
        description: 'Distributing Bibles in local languages to remote villages and communities. Each Bible costs ₦2,000 and we aim to distribute 5,000 Bibles this quarter.',
        category: 'mission',
        fundingGoal: 10000000,
        raised: 3500000,
        status: 'active',
        organizerId: 'org_002',
        location: 'Kano, Nigeria',
        imageUrl: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=800',
        endDate: new Date(Date.now() + 85 * 24 * 60 * 60 * 1000).toISOString() // 85 days from now
    },
    {
        name: 'Church Van for Transportation',
        description: 'Purchasing a church van to transport elderly members, youth groups, and provide mobility for various church activities and outreach programs.',
        category: 'equipment',
        fundingGoal: 8500000,
        raised: 5200000,
        status: 'active',
        organizerId: 'org_003',
        location: 'Owerri, Nigeria',
        imageUrl: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800',
        endDate: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000).toISOString() // 65 days from now
    },
    {
        name: 'Widow Support Program',
        description: 'Monthly support program providing financial assistance, food packages, and vocational training to widows in our community. Empowering them to become self-sufficient.',
        category: 'outreach',
        fundingGoal: 45000,
        raised: 32000,
        status: 'active',
        organizerId: 'org_004',
        location: 'Akure, Nigeria',
        imageUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800',
        endDate: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000).toISOString() // 55 days from now
    }
];

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...\n');
        console.log(`Creating ${sampleProjects.length} sample projects...\n`);

        let successCount = 0;
        let errorCount = 0;

        for (const project of sampleProjects) {
            try {
                const createdProject = await databases.createDocument(
                    DATABASE_ID,
                    'projects',
                    ID.unique(),
                    project
                );

                const percentage = Math.round((project.raised / project.fundingGoal) * 100);
                console.log(`✅ Created: ${project.name}`);
                console.log(`   Category: ${project.category} | Goal: ₦${project.fundingGoal.toLocaleString()} | Raised: ₦${project.raised.toLocaleString()} (${percentage}%)`);
                console.log(`   ID: ${createdProject.$id}\n`);

                successCount++;

                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 200));

            } catch (error) {
                console.error(`❌ Failed to create: ${project.name}`);
                console.error(`   Error: ${error.message}\n`);
                errorCount++;
            }
        }

        console.log('\n═══════════════════════════════════════');
        console.log('✅ DATABASE SEEDING COMPLETE!');
        console.log('═══════════════════════════════════════\n');
        console.log(`📊 Summary:`);
        console.log(`   ✅ Successfully created: ${successCount} projects`);
        console.log(`   ❌ Failed: ${errorCount} projects`);
        console.log(`   📁 Total projects in database: ${successCount}\n`);
        console.log('💡 Next steps:');
        console.log('1. Refresh your browser at http://localhost:5173/discover');
        console.log('2. Test the search, filter, and sort features');
        console.log('3. Click on projects to view details\n');

    } catch (error) {
        console.error('❌ Error during seeding:', error.message);
        console.error('Full error:', error);
    }
}

// Run the seeding
seedDatabase();
