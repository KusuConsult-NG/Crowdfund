# Database Setup Guide for ChurchFlow

## Important Notice

The `appwrite` package (v21.5.0) is a **client-side SDK** and doesn't include admin operations like creating collections. To set up your database, you have two options:

## Option 1: Manual Setup via Appwrite Console (Recommended)

Follow these steps to create your database collections manually:

### 1. Access Appwrite Console
- Go to: https://fra.cloud.appwrite.io/console
- Navigate to your project: `694493d0002c86a5e19e`
- Go to **Databases** section

### 2. Create Database
- Click "Create Database"
- Database ID: `churchflow`
- Name: `ChurchFlow Database`

### 3. Create Collections

#### Collection 1: Projects
**Collection Settings:**
- Collection ID: `projects` (or auto-generate)
- Name: `projects`
- Permissions:
  - Read: Any
  - Create: Users
  - Update: Users  
  - Delete: Users

**Attributes:**
| Name | Type | Size/Max | Required | Default | Array |
|------|------|----------|----------|---------|-------|
| name | String | 255 | Yes | - | No |
| description | String | 10000 | Yes | - | No |
| category | String | 50 | Yes | - | No |
| fundingGoal | Integer | - | Yes | - | No |
| raised | Integer | - | Yes | 0 | No |
| status | String | 20 | Yes | active | No |
| organizerId | String | 255 | Yes | - | No |
| location | String | 255 | No | - | No |
| imageUrl | String | 500 | No | - | No |
| endDate |DateTime | - | Yes | - | No |

#### Collection 2: Donations
**Collection Settings:**
- Collection ID: `donations`
- Name: `donations`
- Permissions:
  - Read: Any
  - Create: Users
  - Update: Users

**Attributes:**
| Name | Type | Size/Max | Required | Default | Array |
|------|------|----------|----------|---------|-------|
| projectId | String | 255 | Yes | - | No |
| userId | String | 255 | Yes | - | No |
| amount | Integer | - | Yes | - | No |
| message | String | 500 | No | - | No |
| anonymous | Boolean | - | Yes | false | No |
| rewardTierId | String | 255 | No | - | No |
| status | String | 20 | Yes | completed | No |

#### Collection 3: Rewards
**Collection Settings:**
- Collection ID: `rewards`
- Name: `rewards`
- Permissions:
  - Read: Any
  - Create: Users
  - Update: Users
  - Delete: Users

**Attributes:**
| Name | Type | Size/Max | Required | Default | Array |
|------|------|----------|----------|---------|-------|
| projectId | String | 255 | Yes | - | No |
| name | String | 255 | Yes | - | No |
| minAmount | Integer | - | Yes | - | No |
| description | String | 1000 | Yes | - | No |
| quantity | Integer | - | No | - | No |
| claimed | Integer | - | Yes | 0 | No |

#### Collection 4: Updates
**Collection Settings:**
- Collection ID: `updates`
- Name: `updates`
- Permissions:
  - Read: Any
  - Create: Users
  - Update: Users
  - Delete: Users

**Attributes:**
| Name | Type | Size/Max | Required | Default | Array |
|------|------|----------|----------|---------|-------|
| projectId | String | 255 | Yes | - | No |
| title | String | 255 | Yes | - | No |
| content | String | 10000 | Yes | - | No |

### 4. Update Configuration
After creating the collections, update `/Users/mac/CrowdFund/src/lib/appwrite.ts` with the collection IDs.

## Option 2: Use Server SDK (For Automated Setup)

If you want to automate the setup process:

1. Install the server SDK:
```bash
npm install node-appwrite --save-dev
```

2. Create an API key in Appwrite Console with proper permissions

3. Update `setup-database.ts` to use `node-appwrite` instead of `appwrite`

4. Run the setup script with your API key

---

## Next Steps After Database Setup

1. ✅ Create collections (via Appwrite Console or Server SDK)
2. Update `src/lib/appwrite.ts` with collection IDs
3. Create service files:
   - `src/services/projectService.ts`
   - `src/services/donationService.ts`
   - `src/services/rewardService.ts`
   - `src/services/updateService.ts`
4. Connect UI components to database services
