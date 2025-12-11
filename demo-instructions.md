# Home Background Upload Feature with Opacity Control

## Overview
The portfolio website now includes the ability to upload and set custom background images for the home/hero section through the admin panel, with adjustable opacity control for perfect visual balance.

## Features Implemented

### 1. Admin Panel Integration
- **Location**: Admin Panel → Settings Tab → "Home Background" section
- **Upload**: File input with image validation
- **Preview**: Live preview of uploaded background image
- **Opacity Control**: Interactive slider to adjust background image opacity
- **Remove**: Option to remove uploaded background and restore default gradient

### 2. Image Management
- **File Validation**: Only image files accepted (jpg, png, gif, etc.)
- **Size Limit**: Maximum 10MB for background images
- **Storage**: Images stored as base64 data in localStorage
- **Preview**: Shows thumbnail in admin panel

### 3. Opacity Control
- **Slider Control**: Range from 0% (transparent) to 100% (opaque)
- **Real-time Preview**: Opacity value displays as you adjust
- **Live Application**: Changes apply immediately to the main website
- **Default Setting**: 50% opacity as starting point

### 4. Frontend Integration
- **Background Application**: Applied to hero section with overlay blend mode
- **Opacity Control**: Smooth opacity adjustment for perfect text readability
- **Fallback**: Graceful fallback to default gradient if no image uploaded
- **Responsive**: Background image scales properly on all devices
- **Real-time Updates**: Changes reflect immediately on the main website

### 5. Technical Implementation
- **Admin Script**: Added `handleBackgroundOpacityChange()`, updated `loadHomeBackgroundPreview()`
- **Main Script**: Enhanced `updateHomeBackground()` with opacity application
- **Storage Integration**: Opacity stored in localStorage as 'backgroundOpacity'
- **Storage Event**: Added 'backgroundOpacity' to storage event listener
- **CSS Integration**: Uses `backgroundBlendMode: 'overlay'` with RGBA gradient

## How to Use

### For Administrators:
1. Open `admin.html` in your browser
2. Login with credentials: `admin` / `admin123`
3. Navigate to "Settings" tab
4. Scroll to "Home Background" section
5. **Upload Background**: Click "Choose File" to upload a background image
6. **Adjust Opacity**: Use the opacity slider (0% = transparent, 100% = opaque)
7. **Preview**: Image and opacity will be previewed and applied immediately
8. **Manage**: Use "Remove Background Image" to restore default gradient

### For End Users:
- Background image appears automatically when set by admin
- Opacity is applied automatically for optimal readability
- No action required from end users
- Website maintains full responsiveness

## File Structure
```
├── admin.html           # Admin panel interface (updated with opacity slider)
├── admin-script.js      # Admin functionality (updated with opacity handlers)
├── index.html           # Main portfolio website
├── script.js            # Main website functionality (updated with opacity application)
└── styles.css           # Styling (existing)
```

## Browser Compatibility
- All modern browsers supporting:
  - File API
  - localStorage
  - CSS background-blend-mode
  - Canvas for image processing
  - CSS RGBA colors
  - Range input sliders

## Benefits
1. **Easy Customization**: No technical knowledge required
2. **Perfect Control**: Adjust opacity for ideal text readability
3. **Instant Preview**: See changes immediately
4. **Space Efficient**: Uses localStorage for client-side storage
5. **Responsive Design**: Background adapts to all screen sizes
6. **Performance**: Base64 encoding eliminates server requests

## Opacity Control Details
- **Range**: 0% to 100% in 1% increments
- **Default**: 50% opacity
- **Visual Effect**: Lower opacity shows more gradient overlay, higher opacity shows more background image
- **Text Readability**: Automatically balanced with gradient overlay
- **Storage**: Persisted in localStorage for consistent experience

## Future Enhancements
- Multiple background presets
- Background image cropping tool
- Scheduled background changes
- Background image gallery
- Advanced overlay controls
- Color temperature adjustment
- Blur effects
- Multiple overlay layers