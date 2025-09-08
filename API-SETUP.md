# TEMPOINK Shopify API Setup & Product Management

## 🚀 Quick Start

### 1. API Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
SHOPIFY_DOMAIN=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_access_token_here
SHOPIFY_SECRET_KEY=your_secret_key_here
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Test Connection
```bash
node scripts/shopify-api-simple.js test
```

## 📦 Product Management

### Generate TEMPOINK Products from Ezink Data
```bash
# Generate products with TMIK-0001 format SKUs
node scripts/extract-ezink-products.js

# Creates:
# - data/tempoink-products-extracted.csv
# - data/tempoink-products-extracted.json
```

### Upload Products via API
```bash
# Upload products from CSV
node scripts/csv-to-shopify.js data/tempoink-products-extracted.csv
```

### Manual API Operations
```bash
# Test API connection
node scripts/shopify-api-simple.js test

# List existing products
node scripts/shopify-api-simple.js products

# List existing collections
node scripts/shopify-api-simple.js collections

# Backup store data
node scripts/shopify-api-simple.js backup
```

## 🔑 Setting Up Private App Access

1. **Go to Shopify Admin** → Apps → App and sales channel settings
2. **Click "Develop apps for your store"**
3. **Create Private App** with these permissions:
   - Products: Read/Write
   - Inventory: Read/Write  
   - Collections: Read/Write
   - Orders: Read
4. **Copy the Admin API access token** to your .env file

## 📄 Product Data Structure

### Generated Products (TMIK-0001 to TMIK-0010):
- Japanese Dragon Sleeve (TMIK-0001) - R299.00
- Geisha (TMIK-0002) - R149.00 ~~R229.00~~
- Blazebone (TMIK-0003) - R229.00  
- Swooping Eagle (TMIK-0004) - R229.00
- Balanced Soul (TMIK-0005) - R199.00 ~~R249.00~~
- Viking Celtic (TMIK-0006) - R189.00
- Fallen Angel (TMIK-0007) - R229.00
- Knight (TMIK-0008) - R229.00
- 3 Sleeve Mystery Pack (TMIK-0009) - R599.00 ~~R899.00~~
- Japanese Waves Sleeve (TMIK-0010) - R299.00

### Collections Created Automatically:
- All Tattoos
- New Tattoos  
- Best Sellers
- On Sale
- Small/Medium/Large Tattoos
- Category-based (Japanese, Animals, etc.)

## 🔧 Scripts Overview

### `shopify-api-simple.js`
Core API wrapper with rate limiting and error handling.

### `extract-ezink-products.js`  
Extracts product data from Ezink.co.za and generates TEMPOINK products with proper SKU format.

### `csv-to-shopify.js`
Parses CSV and uploads products + creates collections via API.

## 📊 Features

### ✅ Implemented
- Product creation via API
- Collection management
- Bulk operations with rate limiting
- CSV import/export
- Store backup functionality  
- SEO optimization
- Inventory management
- TMIK-#### SKU format

### 🔄 Rate Limiting
- 1 second between individual requests
- 2 seconds between batches
- Batch size: 3 products per batch
- API-friendly error handling

## 🐛 Troubleshooting

### API Connection Issues
```bash
# Check credentials
cat .env

# Test connection  
node scripts/shopify-api-simple.js test
```

### Common Errors
- **401 Unauthorized**: Check access token and private app permissions
- **429 Rate Limit**: Scripts automatically handle rate limiting
- **422 Validation**: Check product data format in CSV

## 📈 Usage Analytics

The system tracks:
- Products created/failed
- API request success rates  
- Backup timestamps
- Collection assignments

All results are saved to `data/upload-results-[timestamp].json`

## 🔐 Security Notes

- Never commit `.env` file to git
- Access tokens in `.env` are git-ignored
- Use environment variables for production
- Regularly rotate access tokens