#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const { URL } = require('url');
require('dotenv').config();

class ShopifyAPI {
  constructor() {
    this.domain = process.env.SHOPIFY_DOMAIN;
    this.accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    this.apiVersion = process.env.SHOPIFY_API_VERSION || '2023-10';
    
    if (!this.domain || !this.accessToken) {
      throw new Error('Missing Shopify credentials. Check your .env file.');
    }
  }

  makeRequest(endpoint, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(`/admin/api/${this.apiVersion}${endpoint}`, `https://${this.domain}`);
      
      const options = {
        hostname: url.hostname,
        port: 443,
        path: url.pathname + url.search,
        method: method,
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
          'Content-Type': 'application/json',
          'User-Agent': 'TEMPOINK-API-Client/1.0'
        }
      };

      if (body) {
        const bodyString = JSON.stringify(body);
        options.headers['Content-Length'] = Buffer.byteLength(bodyString);
      }

      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(jsonData);
            } else {
              console.error('API Error Response:', jsonData);
              reject(new Error(`API request failed: ${res.statusCode} ${res.statusMessage}`));
            }
          } catch (error) {
            reject(new Error(`Failed to parse JSON response: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (body) {
        req.write(JSON.stringify(body));
      }
      
      req.end();
    });
  }

  async testConnection() {
    try {
      console.log(`🔗 Testing connection to ${this.domain}...`);
      const shop = await this.makeRequest('/shop.json');
      console.log('✅ Connected to Shopify store:', shop.shop.name);
      console.log('📍 Shop URL:', shop.shop.myshopify_domain);
      console.log('💰 Currency:', shop.shop.currency);
      console.log('🌍 Country:', shop.shop.country);
      console.log('📧 Email:', shop.shop.email);
      return true;
    } catch (error) {
      console.error('❌ Connection test failed:', error.message);
      return false;
    }
  }

  async getProducts(limit = 50) {
    try {
      const data = await this.makeRequest(`/products.json?limit=${limit}`);
      return data.products;
    } catch (error) {
      console.error('Error fetching products:', error.message);
      return [];
    }
  }

  async createProduct(productData) {
    try {
      const data = await this.makeRequest('/products.json', 'POST', {
        product: productData
      });
      console.log(`✅ Created product: ${data.product.title} (ID: ${data.product.id})`);
      return data.product;
    } catch (error) {
      console.error('❌ Error creating product:', error.message);
      throw error;
    }
  }

  async getCollections() {
    try {
      const data = await this.makeRequest('/custom_collections.json');
      return data.custom_collections;
    } catch (error) {
      console.error('Error fetching collections:', error.message);
      return [];
    }
  }

  async createCollection(collectionData) {
    try {
      const data = await this.makeRequest('/custom_collections.json', 'POST', {
        custom_collection: collectionData
      });
      console.log(`✅ Created collection: ${data.custom_collection.title} (ID: ${data.custom_collection.id})`);
      return data.custom_collection;
    } catch (error) {
      console.error('❌ Error creating collection:', error.message);
      throw error;
    }
  }

  async addProductToCollection(collectionId, productId) {
    try {
      const data = await this.makeRequest('/collects.json', 'POST', {
        collect: {
          collection_id: collectionId,
          product_id: productId
        }
      });
      console.log(`✅ Added product ${productId} to collection ${collectionId}`);
      return data.collect;
    } catch (error) {
      console.error('❌ Error adding product to collection:', error.message);
      throw error;
    }
  }

  async bulkCreateProducts(products, batchSize = 3) {
    const results = [];
    console.log(`📦 Creating ${products.length} products in batches of ${batchSize}...`);
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      console.log(`\n🔄 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(products.length/batchSize)}`);
      
      for (let j = 0; j < batch.length; j++) {
        const product = batch[j];
        const overallIndex = i + j + 1;
        
        try {
          console.log(`[${overallIndex}/${products.length}] Creating: ${product.title}`);
          const createdProduct = await this.createProduct(product);
          results.push({ success: true, product: createdProduct });
          
          // Rate limiting - wait 1 second between requests
          if (j < batch.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error(`[${overallIndex}/${products.length}] Failed: ${product.title} - ${error.message}`);
          results.push({ success: false, product: product, error: error.message });
        }
      }
      
      // Wait 2 seconds between batches
      if (i + batchSize < products.length) {
        console.log('⏳ Waiting 2 seconds before next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`\n📊 Bulk Create Summary:`);
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    
    return results;
  }

  async backupStore() {
    console.log('💾 Starting store backup...');
    
    const [products, collections] = await Promise.all([
      this.getProducts(250),
      this.getCollections()
    ]);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = `./data/backups/${timestamp}`;
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    fs.writeFileSync(`${backupDir}/products.json`, JSON.stringify(products, null, 2));
    fs.writeFileSync(`${backupDir}/collections.json`, JSON.stringify(collections, null, 2));
    
    console.log(`✅ Backup completed: ${backupDir}`);
    console.log(`📦 Products backed up: ${products.length}`);
    console.log(`📁 Collections backed up: ${collections.length}`);
    
    return { products, collections };
  }
}

module.exports = ShopifyAPI;

// CLI usage
if (require.main === module) {
  const command = process.argv[2];
  const api = new ShopifyAPI();

  (async () => {
    try {
      switch (command) {
        case 'test':
          await api.testConnection();
          break;
          
        case 'products':
          const products = await api.getProducts();
          console.log(`📦 Found ${products.length} products`);
          products.forEach(p => console.log(`  - ${p.title} (${p.variants.length} variants)`));
          break;
          
        case 'collections':
          const collections = await api.getCollections();
          console.log(`📁 Found ${collections.length} collections`);
          collections.forEach(c => console.log(`  - ${c.title}`));
          break;
          
        case 'backup':
          await api.backupStore();
          break;
          
        default:
          console.log('Usage: node shopify-api-simple.js [test|products|collections|backup]');
      }
    } catch (error) {
      console.error('❌ Command failed:', error.message);
      process.exit(1);
    }
  })();
}