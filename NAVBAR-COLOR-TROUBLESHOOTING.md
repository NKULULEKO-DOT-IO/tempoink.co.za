# TEMPOINK Navbar Color Changes - Troubleshooting Guide

## ✅ Changes Made

I've updated your navbar text and icons from black to charcoal (#444444) for better visibility.

## 🎨 What Changed

**Colors Updated:**
- **Navbar text**: Black (#000000) → Charcoal (#444444)
- **Navbar icons**: Black → Charcoal (#444444) 
- **Hover states**: Dark gray (#666666)
- **Logo**: Now charcoal (#444444)

## 🔧 If Changes Aren't Showing

### 1. **Clear Browser Cache**
- Press `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
- Or open DevTools → Right-click refresh → "Empty Cache and Hard Reload"

### 2. **Check if Using Shopify CLI**
If you're using Shopify CLI for development:
```bash
shopify theme dev
```
The changes should auto-sync to your development store.

### 3. **Upload to Shopify Manually**
If working directly with Shopify Admin:
1. Go to **Online Store** → **Themes**
2. Click **Actions** → **Edit Files**
3. Navigate to `assets/tempoink-theme.css`
4. Copy the updated content from your local file
5. Save the changes

### 4. **Check CSS Priority**
If some elements still show black, add this CSS to override:
```css
/* Emergency override */
.site-header a, 
nav a, 
header a {
  color: #444444 !important;
}
```

## 🎯 CSS Selectors Added

The updated CSS targets these specific elements:
- `.site-header a` - Header links
- `nav a` - Navigation links  
- `header svg` - Header icons
- `.header__menu-item a` - Menu items
- `.navigation a` - Navigation elements

## 🔍 Testing

To verify the changes worked:
1. Inspect element on navbar text/icons
2. Look for `color: #444444` in the styles
3. Check that `!important` declarations are applied

## 📝 CSS File Location

The changes are in:
```
assets/tempoink-theme.css
```

Look for the comment:
```css
/* Updated: 2025-01-09 01:05 - Charcoal Navigation Colors */
```

## 🚀 Alternative: Inline CSS Test

If nothing works, add this temporarily to your theme.liquid `<head>`:

```html
<style>
/* Test navbar colors */
header a, nav a, .site-header a { color: #444444 !important; }
header svg, nav svg, .site-header svg { fill: #444444 !important; }
</style>
```

This will immediately show if the color change works, then you can troubleshoot the main CSS file.