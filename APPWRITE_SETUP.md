# Appwrite Setup Complete! ✅

## Connection Status
✅ **Appwrite SDK successfully connected to your Crowdfunding project**

## Configuration Details
```
Project ID: 694493d0002c86a5e19e
Project Name: Crowdfunding
Endpoint: https://fra.cloud.appwrite.io/v1
```

## Files Created/Modified

### 1. `/src/lib/appwrite.ts`
Main Appwrite configuration file exporting:
- `client` - Appwrite client instance
- `account` - Account service (authentication)
- `databases` - Database service (data storage)
- `storage` - Storage service (file uploads)

### 2. `/src/main.tsx`
Added automatic connection verification on app load:
```typescript
client.ping().then(
  () => console.log('✅ Appwrite connection verified'),
  (error) => console.error('❌ Appwrite connection failed:', error)
);
```

## Next Steps - Building ChurchFlow Backend

### 1️⃣ Create Database Collections
You'll need to create these collections in your Appwrite console:

#### **Projects Collection**
Attributes:
- `name` (string) - Project name
- `description` (text) - Project description
- `category` (string) - Category (building, outreach, mission, equipment)
- `fundingGoal` (integer) - Target amount
- `raised` (integer) - Current raised amount
- `status` (string) - active, completed, pending
- `organizerId` (string) - Reference to user who created it
- `location` (string) - Project location
- `imageUrl` (string) - Project image URL
- `endDate` (datetime) - Campaign end date
- `createdAt` (datetime) - Creation timestamp

#### **Donations Collection**
Attributes:
- `projectId` (string) - Reference to project
- `userId` (string) - Reference to donor
- `amount` (integer) - Donation amount
- `message` (string, optional) - Donor message
- `anonymous` (boolean) - Is anonymous donation
- `rewardTierId` (string, optional) - Selected reward tier
- `status` (string) - pending, completed, failed
- `createdAt` (datetime) - Donation timestamp

#### **Rewards Collection**
Attributes:
- `projectId` (string) - Reference to project
- `name` (string) - Tier name (Bronze, Silver, Gold, Platinum)
- `minAmount` (integer) - Minimum pledge amount
- `description` (text) - Reward description
- `quantity` (integer, optional) - Available quantity
- `claimed` (integer) - Number claimed

#### **Updates Collection**
Attributes:
- `projectId` (string) - Reference to project
- `title` (string) - Update title
- `content` (text) - Update content
- `createdAt` (datetime) - Post timestamp

### 2️⃣ Implement Authentication
Connect your signup/login pages to Appwrite Auth:

**Example for `/src/pages/DonorSignup.tsx`:**
```typescript
import { account } from '../lib/appwrite';
import { ID } from 'appwrite';

const handleSignup = async () => {
  try {
    await account.create(
      ID.unique(),
      email,
      password,
      fullName
    );
    // Redirect to login or dashboard
  } catch (error) {
    console.error('Signup failed:', error);
  }
};
```

**Example for `/src/pages/DonorLogin.tsx`:**
```typescript
import { account } from '../lib/appwrite';

const handleLogin = async () => {
  try {
    await account.createEmailPasswordSession(email, password);
    // Redirect to dashboard
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### 3️⃣ Create Service Layer
Create helper functions for common operations:

**`/src/services/projectService.ts`:**
```typescript
import { databases } from '../lib/appwrite';
import { ID, Query } from 'appwrite';

const DATABASE_ID = 'your-database-id';
const PROJECTS_COLLECTION_ID = 'your-projects-collection-id';

export const projectService = {
  // Get all projects
  async getProjects() {
    return await databases.listDocuments(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID
    );
  },

  // Get single project
  async getProject(projectId: string) {
    return await databases.getDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      projectId
    );
  },

  // Create project
  async createProject(data: any) {
    return await databases.createDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      ID.unique(),
      data
    );
  },

  // Update project
  async updateProject(projectId: string, data: any) {
    return await databases.updateDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      projectId,
      data
    );
  }
};
```

### 4️⃣ File Upload for Project Images
```typescript
import { storage } from '../lib/appwrite';
import { ID } from 'appwrite';

const BUCKET_ID = 'your-bucket-id';

export const uploadProjectImage = async (file: File) => {
  try {
    const response = await storage.createFile(
      BUCKET_ID,
      ID.unique(),
      file
    );
    return response;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};
```

### 5️⃣ Real-time Updates
Subscribe to live donation updates:
```typescript
import { client } from '../lib/appwrite';

client.subscribe(
  `databases.${DATABASE_ID}.collections.${DONATIONS_COLLECTION_ID}.documents`,
  (response) => {
    console.log('New donation:', response);
    // Update UI with new donation
  }
);
```

## Quick Action Items

1. **Go to Appwrite Console**: https://cloud.appwrite.io/console/project-694493d0002c86a5e19e
2. **Create Database**: Create a new database called "crowdfunding"
3. **Create Collections**: Add the 4 collections listed above
4. **Set Permissions**: Configure read/write permissions for each collection
5. **Create Storage Bucket**: For project images/videos
6. **Get IDs**: Copy database ID, collection IDs, and bucket ID
7. **Update Code**: Replace placeholder IDs in service files

## Environment Variables (Optional)
For better organization, create `.env.local`:
```
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=694493d0002c86a5e19e
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_PROJECTS_COLLECTION_ID=your-projects-collection-id
VITE_APPWRITE_DONATIONS_COLLECTION_ID=your-donations-collection-id
VITE_APPWRITE_REWARDS_COLLECTION_ID=your-rewards-collection-id
VITE_APPWRITE_UPDATES_COLLECTION_ID=your-updates-collection-id
VITE_APPWRITE_BUCKET_ID=your-bucket-id
```

Then update `appwrite.ts`:
```typescript
const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
```

## Resources
- **Appwrite Docs**: https://appwrite.io/docs
- **React + Appwrite Tutorial**: https://appwrite.io/docs/tutorials/react
- **Your Project Console**: https://cloud.appwrite.io/console/project-694493d0002c86a5e19e

## What's Next?
You can now:
1. Set up database collections in Appwrite console
2. Implement authentication in signup/login pages
3. Create service layer for API calls
4. Connect forms to real data
5. Add file upload functionality
6. Implement real-time features

Let me know which feature you want to build first! 🚀
