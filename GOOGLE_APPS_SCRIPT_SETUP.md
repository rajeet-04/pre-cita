# Google Apps Script Setup Guide

This guide will help you set up a Google Apps Script to receive contact form submissions from your website and store them in a Google Sheet.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it something like "Pre-Cita Contact Form Submissions"
4. In the first row, add headers:
   - A1: `timestamp`
   - B1: `email`
   - C1: `phone`

## Step 2: Create and Deploy Google Apps Script

1. Open your Google Sheet
2. Click **Extensions** → **Apps Script**
3. Delete any default code and replace it with the code below:

```javascript
function doPost(e) {
  try {
    // Get the sheet
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Parse the request body
    const data = JSON.parse(e.postData.contents);
    
    // Add a new row with the data
    sheet.appendRow([
      data.timestamp,
      data.email,
      data.phone
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Step 3: Deploy the Script

1. In the Apps Script editor, click the **Deploy** button (top right)
2. Select **New deployment**
3. Choose type: **Web app**
4. Execute as: Your Google Account
5. Who has access: **Anyone**
6. Click **Deploy**
7. You'll see a dialog with your deployment URL - **copy this URL**

## Step 4: Configure Your Environment

1. In your project root, create a `.env.local` file (copy from `.env.local.example`)
2. Replace the placeholder with your actual Google Apps Script URL:
   ```
   NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/d/{YOUR_SCRIPT_ID}/usercontent
   ```

## Step 5: Test the Form

1. Start your development server: `npm run dev` (or `pnpm dev`)
2. Navigate to `http://localhost:3000`
3. Fill out the contact form with an email and/or phone number
4. Submit the form
5. Check your Google Sheet - the new submission should appear in a new row

## Troubleshooting

### Form submissions not appearing in the sheet?

1. **Check the Apps Script deployment is set to "Anyone"** - permissions are critical
2. **Verify your URL is correct** - copy it directly from the deployment dialog
3. **Check browser console** - look for errors (press F12 or right-click → Inspect)
4. **Verify the JSON format** - make sure the form data matches what the script expects

### Update existing deployment

If you need to update the Apps Script code:
1. Make changes to the code
2. Click **Deploy** → **Manage deployments**
3. Click the pencil icon next to your deployment
4. Click **Deploy** to save changes

## Important Security Notes

- Set "Execute as" to your account (not user account) so script runs reliably
- Set "Who has access" to "Anyone" so the form can submit
- The form posts to the public endpoint - no authentication token is needed
- CORS is automatically handled by Google Apps Script's `doPost` function

## Data Format

The form sends data in this JSON format:
```json
{
  "email": "user@example.com",
  "phone": "+1 (555) 123-4567",
  "timestamp": "2026-03-30T10:30:00.000Z"
}
```

Either email or phone (or both) will be provided. If not filled, the value will be "Not provided".
