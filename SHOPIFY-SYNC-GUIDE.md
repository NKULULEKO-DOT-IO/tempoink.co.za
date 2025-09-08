# How to Sync Changes from Shopify Theme Editor

## 🔄 Problem
You made changes directly in Shopify's theme editor, but those changes aren't in your local repository yet.

## 📥 Solution Options

### Option 1: Shopify CLI (Recommended)
```bash
# Install Shopify CLI if not already installed
npm install -g @shopify/cli@latest

# Login to Shopify
shopify auth login

# Pull theme from Shopify
shopify theme pull

# Or pull specific theme
shopify theme pull --theme-id=THEME_ID
```

### Option 2: Download from Admin
1. Go to **Online Store** → **Themes**
2. Click **Actions** → **Download theme files**
3. Extract the ZIP file
4. Compare with your local files
5. Copy over the changes you made

### Option 3: Manual File Sync
For specific files you changed in the editor:
1. Go to **Online Store** → **Themes** → **Actions** → **Edit code**
2. Find the files you modified
3. Copy the content
4. Paste into your local files

## 🎯 Files That Likely Changed
Based on your upload error, you probably modified:
- `templates/index.json` - Homepage template
- `assets/` files - CSS or other assets
- `sections/` files - Theme sections

## 🚨 Current Upload Error Fix
The error "Template type 'index-tempoink' does not support JSON templates" means:

1. **Check for invalid template names** in `templates/` folder
2. **Remove any `.json` files with non-standard names**
3. **Only use standard Shopify template names like:**
   - `index.json` ✅
   - `product.json` ✅  
   - `collection.json` ✅
   - `index-tempoink.json` ❌ (Invalid)

## 🔧 Quick Fix Commands
```bash
# Check for problematic templates
find templates/ -name "*tempoink*.json"

# Remove invalid template files
rm templates/index-tempoink.json  # if it exists

# Verify standard templates exist
ls templates/index.json
```

## 📝 After Syncing
1. Test the navbar color changes
2. Verify the gradient overlays work
3. Check that products and images display correctly
4. Commit the synced changes to git