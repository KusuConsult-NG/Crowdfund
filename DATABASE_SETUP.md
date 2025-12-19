# Database Setup Guide

## Option 1: Automated Setup (Recommended)

Run the automated setup script:

```bash
# Install ts-node if you don't have it
npm install -D ts-node

# Run the setup script
npx ts-node setup-database.ts
```

This will automatically:
- Create the database
- Create all 4 collections (projects, donations, rewards, updates)
- Add all necessary attributes with proper types
- Set up permissions

## Option 2: Manual Setup

### Step 1: Create Database

1. Go to **Databases** in your Appwrite console
2. Click **Create Database**
3. Name: `churchflow` (or any name you prefer)
4. Click **Create**
5. **Copy the Database ID** - you'll need this!

### Step 2: Create Collections

#### Collection 1: Projects

**Create Collection:**
- Name: `projects`
- Collection ID: Auto-generate or use `projects`
- Permissions:
  - Read: Any
  - Create: Users
  - Update: Users
  - Delete: Users

**Add Attributes:**
1. `name` - String (255) - Required
2. `description` - String (10000) - Required
3. `category` - String (50) - Required
4. `fundingGoal` - Integer - Required
5. `raised` - Integer - Required - Default: 0
6. `status` - String (20) - Required - Default: "active"
7. `organizerId` - String (255) - Required
8. `location` - String (255) - Optional
9. `imageUrl` - String (500) - Optional
10. `endDate` - Datetime - Required

**Create Indexes:**
- `status_index` on `status` (ASC)
- `category_index` on `category` (ASC)
- `organizer_index` on `organizerId` (ASC)

---

#### Collection 2: Donations

**Create Collection:**
- Name: `donations`
- Permissions:
  - Read: Any
  - Create: Users
  - Update: Users

**Add Attributes:**
1. `projectId` - String (255) - Required
2. `userId` - String (255) - Required
3. `amount` - Integer - Required
4. `message` - String (500) - Optional
5. `anonymous` - Boolean - Required - Default: false
6. `rewardTierId` - String (255) - Optional
7. `status` - String (20) - Required - Default: "completed"

**Create Indexes:**
- `project_index` on `projectId` (ASC)
- `user_index` on `userId` (ASC)

---

#### Collection 3: Rewards

**Create Collection:**
- Name: `rewards`
- Permissions:
  - Read: Any
  - Create: Users
  - Update: Users
  - Delete: Users

**Add Attributes:**
1. `projectId` - String (255) - Required
2. `name` - String (255) - Required
3. `minAmount` - Integer - Required
4. `description` - String (1000) - Required
5. `quantity` - Integer - Optional
6. `claimed` - Integer - Required - Default: 0

**Create Indexes:**
- `project_index` on `projectId` (ASC)

---

#### Collection 4: Updates

**Create Collection:**
- Name: `updates`
- Permissions:
  - Read: Any
  - Create: Users
  - Update: Users
  - Delete: Users

**Add Attributes:**
1. `projectId` - String (255) - Required
2. `title` - String (255) - Required
3. `content` - String (10000) - Required

**Create Indexes:**
- `project_index` on `projectId` (ASC)

---

## Step 3: Copy Your IDs

After creating everything, you'll have:

```
Database ID: [Your Database ID]
Projects Collection ID: [Your Collection ID]
Donations Collection ID: [Your Collection ID]
Rewards Collection ID: [Your Collection ID]
Updates Collection ID: [Your Collection ID]
```

## Step 4: Update Your Code

Create a new file `src/config/database.ts`:

```typescript
export const DATABASE_CONFIG = {
  DATABASE_ID: 'your-database-id',
  COLLECTIONS: {
    PROJECTS: 'your-projects-collection-id',
    DONATIONS: 'your-donations-collection-id',
    REWARDS: 'your-rewards-collection-id',
    UPDATES: 'your-updates-collection-id'
  }
};
```

## Next Steps

Once the database is set up:

1. ✅ Create service layer for CRUD operations
2. ✅ Connect Project Discovery to real data
3. ✅ Make Create Project save to database
4. ✅ Enable real donations

## Permissions Explained

- **Read: Any** - Anyone can view (public projects)
- **Create: Users** - Only logged-in users can create
- **Update: Users** - Only logged-in users can update
- **Delete: Users** - Only logged-in users can delete

**Note:** You can make permissions more restrictive later (e.g., only project owner can update their project).

## Troubleshooting

**Error: "Attribute already exists"**
- The attribute name is already in use. Skip or use a different name.

**Error: "Collection limit reached"**
- Free tier has a limit. Delete unused collections or upgrade.

**Error: "Permission denied"**
- Check your API key has proper permissions in Appwrite console.
