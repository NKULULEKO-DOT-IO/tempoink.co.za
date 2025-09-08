#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const ShopifyAPI = require('./shopify-api-simple');

class CSVToShopify {
  constructor() {
    this.api = new ShopifyAPI();
    this.collections = new Map();
  }

  async parseCSV(filePath) {
    return new Promise((resolve, reject) => {
      const products = [];
      const productMap = new Map();

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          const handle = row.Handle;
          
          if (!handle) return; // Skip empty rows
          
          if (!productMap.has(handle)) {
            // Create new product
            const product = {
              title: row.Title,
              body_html: row['Body (HTML)'],
              vendor: row.Vendor,
              product_type: row.Type,
              tags: row.Tags,
              published: row.Published === 'TRUE',
              variants: [],
              images: [],
              seo_title: row['SEO Title'],
              seo_description: row['SEO Description'],
              handle: handle
            };
            
            productMap.set(handle, product);
            products.push(product);
          }
          
          const product = productMap.get(handle);
          
          // Add variant if SKU exists
          if (row['Variant SKU']) {
            const variant = {
              sku: row['Variant SKU'],
              price: row['Variant Price'],
              compare_at_price: row['Variant Compare At Price'] || null,
              inventory_quantity: parseInt(row['Variant Inventory Qty']) || 0,
              inventory_policy: row['Variant Inventory Policy'] || 'deny',
              fulfillment_service: row['Variant Fulfillment Service'] || 'manual',
              inventory_management: row['Variant Inventory Tracker'] || 'shopify',
              requires_shipping: row['Variant Requires Shipping'] === 'TRUE',
              taxable: row['Variant Taxable'] === 'TRUE',
              barcode: row['Variant Barcode'] || null,
              weight: parseInt(row['Variant Grams']) || 0,
              weight_unit: row['Variant Weight Unit'] || 'g'
            };

            // Handle options
            if (row['Option1 Name'] && row['Option1 Value']) {
              variant.option1 = row['Option1 Value'];
              if (!product.options) product.options = [];
              if (!product.options.find(opt => opt.name === row['Option1 Name'])) {
                product.options.push({
                  name: row['Option1 Name'],
                  values: [row['Option1 Value']]
                });
              } else {
                const option = product.options.find(opt => opt.name === row['Option1 Name']);
                if (!option.values.includes(row['Option1 Value'])) {
                  option.values.push(row['Option1 Value']);
                }
              }
            }

            if (row['Option2 Name'] && row['Option2 Value']) {
              variant.option2 = row['Option2 Value'];
              if (!product.options.find(opt => opt.name === row['Option2 Name'])) {
                product.options.push({
                  name: row['Option2 Name'],
                  values: [row['Option2 Value']]
                });
              }
            }

            if (row['Option3 Name'] && row['Option3 Value']) {
              variant.option3 = row['Option3 Value'];
              if (!product.options.find(opt => opt.name === row['Option3 Name'])) {
                product.options.push({
                  name: row['Option3 Name'],
                  values: [row['Option3 Value']]
                });
              }
            }

            product.variants.push(variant);
          }
          
          // Add image if exists
          if (row['Image Src'] && !product.images.find(img => img.src === row['Image Src'])) {
            product.images.push({
              src: row['Image Src'],
              alt: row['Image Alt Text'] || row.Title,
              position: parseInt(row['Image Position']) || 1
            });
          }
        })
        .on('end', () => {
          console.log(`📊 Parsed ${products.length} products from CSV`);
          resolve(products);
        })
        .on('error', reject);
    });
  }

  async createCollectionsFromTags(products) {
    const tagCollections = new Set();
    
    // Extract unique tags for collections
    products.forEach(product => {
      if (product.tags) {
        product.tags.split(',').forEach(tag => {
          const cleanTag = tag.trim();
          if (cleanTag && !['New', 'Best Seller', 'On Sale'].includes(cleanTag)) {
            tagCollections.add(cleanTag);
          }
        });
      }
    });

    // Create predefined collections
    const predefinedCollections = [
      { title: 'All Tattoos', handle: 'all-tattoos', description: 'Complete collection of TEMPOINK temporary tattoos' },
      { title: 'New Tattoos', handle: 'new-tattoos', description: 'Latest temporary tattoo designs' },
      { title: 'Best Sellers', handle: 'best-sellers', description: 'Most popular temporary tattoos' },
      { title: 'On Sale', handle: 'on-sale', description: 'Discounted temporary tattoos' },
      { title: 'Tattoo Packs', handle: 'tattoo-packs', description: 'Bundled tattoo collections at great prices' },
      { title: 'Small Tattoos', handle: 'small-tattoos', description: 'Compact designs perfect for subtle placement' },
      { title: 'Medium Tattoos', handle: 'medium-tattoos', description: 'Medium-sized designs for versatile placement' },
      { title: 'Large Tattoos', handle: 'large-tattoos', description: 'Bold, large designs for maximum impact' }
    ];

    console.log('📁 Creating collections...');
    
    for (const collection of predefinedCollections) {
      try {
        const created = await this.api.createCollection(collection);
        this.collections.set(collection.handle, created.id);
        await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
      } catch (error) {
        if (error.message.includes('Handle has already been taken')) {
          console.log(`ℹ️  Collection '${collection.title}' already exists`);
        } else {
          console.error(`❌ Error creating collection '${collection.title}':`, error.message);
        }
      }
    }

    // Create tag-based collections
    for (const tag of tagCollections) {
      const handle = tag.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/--+/g, '-');
      const collection = {
        title: `${tag} Tattoos`,
        handle: `${handle}-tattoos`,
        description: `Temporary tattoos featuring ${tag.toLowerCase()} designs`
      };

      try {
        const created = await this.api.createCollection(collection);
        this.collections.set(collection.handle, created.id);
        await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
      } catch (error) {
        if (error.message.includes('Handle has already been taken')) {
          console.log(`ℹ️  Collection '${collection.title}' already exists`);
        } else {
          console.error(`❌ Error creating collection '${collection.title}':`, error.message);
        }
      }
    }
  }

  async uploadProducts(products) {
    console.log(`🚀 Starting upload of ${products.length} products...`);
    
    const results = await this.api.bulkCreateProducts(products);
    
    // Add products to collections based on tags
    console.log('🏷️  Adding products to collections...');
    for (const result of results) {
      if (result.success && result.product.tags) {
        const tags = result.product.tags.split(',').map(t => t.trim());
        
        // Add to All Tattoos
        if (this.collections.has('all-tattoos')) {
          await this.api.addProductToCollection(this.collections.get('all-tattoos'), result.product.id);
        }
        
        // Add to specific collections based on tags
        for (const tag of tags) {
          const handle = tag.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/--+/g, '-');
          
          if (tag === 'New' && this.collections.has('new-tattoos')) {
            await this.api.addProductToCollection(this.collections.get('new-tattoos'), result.product.id);
          } else if (tag === 'Best Seller' && this.collections.has('best-sellers')) {
            await this.api.addProductToCollection(this.collections.get('best-sellers'), result.product.id);
          } else if (tag === 'On Sale' && this.collections.has('on-sale')) {
            await this.api.addProductToCollection(this.collections.get('on-sale'), result.product.id);
          } else if (this.collections.has(`${handle}-tattoos`)) {
            await this.api.addProductToCollection(this.collections.get(`${handle}-tattoos`), result.product.id);
          }
          
          // Add to size collections
          if (['Small', 'Medium', 'Large'].includes(tag)) {
            const sizeHandle = `${tag.toLowerCase()}-tattoos`;
            if (this.collections.has(sizeHandle)) {
              await this.api.addProductToCollection(this.collections.get(sizeHandle), result.product.id);
            }
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 200)); // Rate limiting
      }
    }
    
    return results;
  }

  async processCSVFile(filePath) {
    try {
      // Test connection first
      const connected = await this.api.testConnection();
      if (!connected) {
        throw new Error('Failed to connect to Shopify API');
      }

      // Parse CSV
      const products = await this.parseCSV(filePath);
      
      // Create collections
      await this.createCollectionsFromTags(products);
      
      // Upload products
      const results = await this.uploadProducts(products);
      
      // Save results
      const resultFile = `./data/upload-results-${Date.now()}.json`;
      fs.writeFileSync(resultFile, JSON.stringify(results, null, 2));
      console.log(`📄 Results saved to: ${resultFile}`);
      
      return results;
      
    } catch (error) {
      console.error('❌ Process failed:', error);
      throw error;
    }
  }
}

// CLI usage
if (require.main === module) {
  const csvFile = process.argv[2] || './data/tempoink-products.csv';
  
  if (!fs.existsSync(csvFile)) {
    console.error(`❌ CSV file not found: ${csvFile}`);
    process.exit(1);
  }
  
  const uploader = new CSVToShopify();
  uploader.processCSVFile(csvFile)
    .then(results => {
      const successful = results.filter(r => r.success).length;
      console.log(`\n🎉 Upload complete! ${successful} products created successfully.`);
    })
    .catch(error => {
      console.error('💥 Upload failed:', error.message);
      process.exit(1);
    });
}

module.exports = CSVToShopify;