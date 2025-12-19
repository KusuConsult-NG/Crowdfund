# Fix: Manually Create Status Index in Appwrite

The Discovery page is failing to load because the `status` field needs a database index for the filtering query to work.

## Steps to Create the Index:

1. **Open Appwrite Console**
   - Go to: https://fra.cloud.appwrite.io/
   - Log in to your account

2. **Navigate to Your Database**
   - Click on "Databases" in the left sidebar
   - Click on your database (ID: `69449bae002ad7ffd2a2`)
   - Click on the "projects" collection

3. **Create the Index**
   - Click on the "Indexes" tab
   - Click the "Create Index" button
   - Fill in the following:
     - **Key**: `idx_status`
     - **Type**: Select "Key" (not Fulltext or Unique)
     - **Attributes**: Select `status` from the dropdown
     - **Order**: ASC (default is fine)
   - Click "Create"

4. **Verify**
   - You should see `idx_status` appear in the list of indexes
   - Wait a few seconds for the index to be built (usually instant)

5. **Refresh Your Browser**
   - Go back to http://localhost:5173/discover
   - Refresh the page
   - Projects should now load successfully

## Why This Is Needed:

Appwrite requires indexes for any field you want to use in equality queries (`Query.equal()`). Without the index, the database will reject the query with an error, which causes the "Failed to load projects" message.
