# 🔧 Troubleshooting Guide - Portfolio Synchronization

## Issue: Changes in Admin Panel Not Appearing on Main Page

### Step-by-Step Diagnosis & Fix

#### 1. **Quick Test (No Server Required)**
1. Open `test-api.html` in your browser
2. Check the results - it will show you exactly what's working and what isn't

#### 2. **Check Server Status**
If test shows server is NOT running:
- **Windows**: Double-click `start.bat`
- **Mac/Linux**: Run `./start.sh` in terminal
- **Manual**: 
  ```bash
  npm install
  npm start
  ```

#### 3. **Verify API Connection**
After starting server:
1. Open http://localhost:3000/test-api.html
2. All tests should show ✅ (green checkmarks)
3. If any show ❌ (red X), check the error message

#### 4. **Test Admin Panel**
1. Open http://localhost:3000/admin.html
2. Login with: `admin` / `admin123`
3. Make a small change (e.g., change your name)
4. Click "Save Changes"
5. Check for success message

#### 5. **Test Main Page Sync**
1. Open http://localhost:3000/index.html in a **new tab**
2. **Refresh the page** (Ctrl+F5 or Cmd+Shift+R)
3. **Check if changes appear**:
   - Your name should update in navigation
   - About section should show new name
   - Contact info should update

### Common Issues & Solutions

#### Issue: "Server not running"
**Solution**: 
- Make sure Node.js is installed: https://nodejs.org/
- Check if port 3000 is available
- Try running `npm install` first, then `npm start`

#### Issue: "API requests failing"
**Solution**:
- Check browser console (F12) for error messages
- Verify you're accessing http://localhost:3000 (not file://)
- Make sure server shows "Server running on http://localhost:3000"

#### Issue: "Changes not syncing between tabs"
**Solution**:
- **Refresh the main page** after making admin changes
- Check if both pages are using the improved scripts
- Verify server is running and responding

#### Issue: "Login not working"
**Solution**:
- Make sure you're using the fallback script initially
- Credentials are: `admin` / `admin123`
- If server is running, it will automatically switch to API mode

### Testing Steps Checklist

- [ ] **Server running**: `test-api.html` shows all ✅
- [ ] **Admin login works**: Can login to admin panel
- [ ] **Admin save works**: Changes show success message
- [ ] **Main page loads**: index.html displays properly
- [ ] **Data syncs**: Changes appear on main page after refresh
- [ ] **Cross-device**: Works from different devices on same network

### Browser Console Debugging

Open browser console (F12) and look for these messages:

**✅ Good messages:**
- "Loading data from API..."
- "Data loaded successfully"
- "Portfolio content update completed"
- "Portfolio grid updated with X items"

**❌ Error messages:**
- "API request failed" - Server not running
- "Failed to load data from API" - Connection issue
- "Server not running or not accessible" - Server offline

### Force Refresh Cache

If changes still don't appear:
1. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear cache**: Browser Settings > Clear Browsing Data
3. **Incognito mode**: Test in private/incognito window

### Network Testing

To test cross-device sync:
1. Find your computer's IP: 
   - Windows: `ipconfig` in command prompt
   - Mac/Linux: `ifconfig` in terminal
2. Other devices access: `http://YOUR-IP:3000`
3. Example: `http://192.168.1.100:3000`

### File Verification

Ensure these files are correct:
- ✅ `index.html` - Uses `script-improved.js`
- ✅ `admin.html` - Uses `admin-script-fallback.js` (initially)
- ✅ `server.js` - Backend API server
- ✅ `package.json` - Dependencies

### Getting Help

If still not working:

1. **Check browser console** for specific error messages
2. **Run the diagnostic test** in `test-api.html`
3. **Verify server logs** show no errors
4. **Test in different browser** to rule out browser-specific issues

### Success Indicators

You'll know it's working when:
- ✅ Admin panel shows "Server mode active" after login
- ✅ Changes save with success messages in admin
- ✅ Main page shows updated content after refresh
- ✅ No console errors related to API requests
- ✅ Cross-device access works (same network)

The synchronization should now work perfectly across all devices! 🎉