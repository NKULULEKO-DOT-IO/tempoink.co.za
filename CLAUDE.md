# CLAUDE.md

This file contains project-specific information for Claude Code.

## Project: TEMPOINK

This is a Shopify theme project for TEMPOINK, a temporary tattoo e-commerce store, built with Liquid templating and custom CSS/JavaScript.

## Commands

Essential Shopify theme development commands:

```bash
# Shopify Theme Management
shopify theme pull --live    # Pull latest theme files from Shopify
shopify theme push --live    # Push theme changes to live store
shopify theme dev           # Start development server

# Git Workflow
git status                  # Check current changes
git add .                   # Stage all changes
git commit -m "message"     # Commit with descriptive message
git branch                  # List all branches
git checkout -b branch-name # Create new branch
```

## 🚨 CRITICAL: Safe Development Workflow

### **⚠️ ALWAYS Follow This Development Process:**

**1. Start Every Session with Sync:**
```bash
# MANDATORY: Pull latest changes from live before starting
shopify theme pull --live
git add .
git commit -m "Sync: Pull latest live theme changes"
```

**2. Create Feature Branch:**
```bash
# Never work directly on main/master
git checkout -b feature/your-feature-name
```

**3. Local Development:**
```bash
# Start local development server
shopify theme dev

# Make changes and test locally
# Access: http://127.0.0.1:9292
```

**4. Test on Development Theme First:**
```bash
# NEVER push directly to live - test on dev theme first
shopify theme push --unpublished

# This creates a preview theme you can test safely
# Test thoroughly before going live
```

**5. Commit and Deploy Safely:**
```bash
# Commit your changes
git add .
git commit -m "Descriptive commit message"

# ONLY after thorough testing on dev theme:
shopify theme push --live
```

### **🛡️ Critical Safety Rules:**

**❌ NEVER DO:**
- Push directly to live without testing on dev theme
- Work without pulling latest changes first
- Skip committing changes before deploying
- Override settings without backup
- Work on live theme without local backup

**✅ ALWAYS DO:**
- Pull live changes before starting (`shopify theme pull --live`)
- Test on development theme first (`shopify theme push --unpublished`)
- Commit changes before pushing (`git commit`)
- Create feature branches for new work
- Keep git history clean with descriptive commits

### **🔄 Settings Synchronization Protocol:**

**Theme Settings (`config/settings_data.json`):**
```bash
# Before making settings changes:
shopify theme pull --live --only=config/

# After settings changes:
git add config/settings_data.json
git commit -m "Update: Theme settings - [describe changes]"
shopify theme push --live --only=config/
```

**Template Files:**
```bash
# Pull templates before editing:
shopify theme pull --live --only=templates/

# Push templates safely:
shopify theme push --unpublished --only=templates/
# Test thoroughly, then:
shopify theme push --live --only=templates/
```

### **🚑 Emergency Recovery Commands:**

**If You Made a Mistake:**
```bash
# Revert to last known good state:
git log --oneline -10  # Find good commit
git reset --hard COMMIT_HASH

# Restore live theme from git:
shopify theme push --live
```

**If Live Theme is Broken:**
```bash
# Emergency restore from git:
git checkout main
shopify theme push --live

# Or restore from backup branch:
git checkout feature/header-modifications  # Last known good
shopify theme push --live
```

### **📋 Daily Development Checklist:**

- [ ] `shopify theme pull --live` (sync latest)
- [ ] `git add . && git commit -m "Sync: Latest live changes"`
- [ ] Create feature branch if starting new work
- [ ] `shopify theme dev` (start local development)
- [ ] Make and test changes locally
- [ ] `shopify theme push --unpublished` (test on dev theme)
- [ ] Thoroughly test preview theme
- [ ] `git add . && git commit -m "Feature: Description"`
- [ ] `shopify theme push --live` (deploy to live)
- [ ] Verify live site functionality

## Recent Development Work

### EZINK-Style Mega Menu Implementation (2025-01-11)

**Branches:**
- `feature/header-modifications` - Header styling and announcement banner updates
- `feature/ezink-mega-menu` - EZINK-style mega menu implementation

**Key Changes:**

1. **Promotional Banner** (`snippets/announcement.liquid`)
   - Implemented EZINK-style scrolling marquee banner
   - South African content: "SPEND R750 FOR A FREE TATTOO PACK" • "NEXT DAY SHIPPING IN DURBAN" • "FREE EXPRESS SHIPPING ON ORDERS R1000+"
   - Dark theme (#2c2c2c background) with smooth animations

2. **Mega Menu System** (`snippets/navigation.liquid`)
   - Created 8-column EZINK-style categories mega menu
   - Categories: BODY PART, ANIMAL, NATURE, POP CULTURE, FANTASY, SYMBOL & QUOTE, SPIRITUAL, ARTISTS
   - 100+ subcategory links matching EZINK's exact structure
   - Artist handles integration (@rob.c.art, @llims.art, etc.)

3. **CSS Enhancements** (`assets/dt-custom.css.liquid`)
   - 8-column responsive grid layout (1400px → 4 cols → 2 cols → 1 col)
   - EZINK-style typography: uppercase headers, clean borders
   - Enhanced hover animations and transitions
   - Mobile-first responsive design

**Menu Configuration Analysis:**
- Current menu: "main-menu" handle in settings_data.json
- Mega menu colors: #313131 background, #ebebeb text, #f17c8f accents
- Full schema documentation completed for menu customization

## Theme Structure

**Key Files:**
- `sections/header.liquid` - Main header section with navigation
- `snippets/navigation.liquid` - Dynamic navigation menu system
- `snippets/announcement.liquid` - Promotional banner component
- `assets/dt-custom.css.liquid` - Custom theme styling
- `config/settings_data.json` - Theme configuration and menu settings

**Navigation System:**
- Supports mega menus for: Tattoos, Categories, On Sale, Artists, Tattoo Packs
- Dynamic menu generation from Shopify admin
- Configurable styling through theme settings
- Mobile-responsive with hamburger menu

## API Testing and Validation (2025-01-11)

### Shopify Admin API Access Verification

**Environment Variables:**
```bash
# Stored in .env file (not committed to git)
SHOPIFY_DOMAIN=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_access_token_here
SHOPIFY_SECRET_KEY=your_secret_key_here
```

**API Access Results:**

✅ **GraphQL Admin API (2024-10)** - Fully functional
- Menu management: Read/write navigation menus
- Collection management: Create, read, update, delete collections
- Page management: Create, read, update, delete pages  
- Product management: Full CRUD operations on products

**Current Store Inventory:**
- **Collections**: frontpage, all-tattoos, new-tattoos, best-sellers, on-sale
- **Products**: Japanese Dragon Sleeve, Geisha, Blazebone, Swooping Eagle, Balanced Soul
- **Menus**: main-menu (3 items), footer (1 item), customer-account-main-menu (2 items)
- **Pages**: contact page

**Menu Structure Analysis:**
- Current main menu is basic (Home, Catalog, Contact)
- EZINK-style mega menu implementation exists in theme files but not reflected in Shopify admin
- Need to populate menu structure with 8 categories: BODY PART, ANIMAL, NATURE, POP CULTURE, FANTASY, SYMBOL & QUOTE, SPIRITUAL, ARTISTS

**Next Steps:**
- Update Shopify admin menu structure to match theme's mega menu capabilities
- Create collections for each mega menu category
- Populate collections with appropriate products

## Notes

- Current branch: feature/ezink-mega-menu
- Theme uses comprehensive mega menu system with predefined templates
- All changes committed with proper git workflow
- API access validated for full store management capabilities
- Ready for Shopify deployment and testing