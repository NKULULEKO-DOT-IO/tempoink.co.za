#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Dynamic import for node-fetch (ES6 module)
let fetch;
(async () => {
  fetch = (await import('node-fetch')).default;
})();

class ShopifyAPI {
  constructor() {
    this.domain = process.env.SHOPIFY_DOMAIN;
    this.accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    this.apiVersion = process.env.SHOPIFY_API_VERSION || '2023-10';
    this.baseUrl = `https://${this.domain}/admin/api/${this.apiVersion}`;
    
    if (!this.domain || !this.accessToken) {
      throw new Error('Missing Shopify credentials. Check your .env file.');
    }
  }

  async makeRequest(endpoint, method = 'GET', body = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: {
        'X-Shopify-Access-Token': this.accessToken,
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      
      if (!response.ok) {
        console.error('API Error:', data);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      return data;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  // Test API connection
  async testConnection() {
    try {
      const shop = await this.makeRequest('/shop.json');
      console.log('✅ Connected to Shopify store:', shop.shop.name);
      console.log('📍 Shop URL:', shop.shop.myshopify_domain);
      console.log('💰 Currency:', shop.shop.currency);
      return true;
    } catch (error) {
      console.error('❌ Connection test failed:', error.message);
      return false;
    }
  }

  // Products Management
  async getProducts(limit = 250) {
    try {
      const data = await this.makeRequest(`/products.json?limit=${limit}`);
      return data.products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async createProduct(productData) {
    try {
      const data = await this.makeRequest('/products.json', 'POST', {
        product: productData
      });
      console.log(`✅ Created product: ${data.product.title}`);
      return data.product;
    } catch (error) {
      console.error('❌ Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(productId, productData) {
    try {
      const data = await this.makeRequest(`/products/${productId}.json`, 'PUT', {
        product: productData
      });
      console.log(`✅ Updated product: ${data.product.title}`);
      return data.product;
    } catch (error) {
      console.error('❌ Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      await this.makeRequest(`/products/${productId}.json`, 'DELETE');
      console.log(`✅ Deleted product ID: ${productId}`);
    } catch (error) {
      console.error('❌ Error deleting product:', error);
      throw error;
    }
  }

  // Collections Management
  async getCollections() {
    try {
      const data = await this.makeRequest('/custom_collections.json');
      return data.custom_collections;
    } catch (error) {
      console.error('Error fetching collections:', error);
      return [];
    }
  }

  async createCollection(collectionData) {
    try {
      const data = await this.makeRequest('/custom_collections.json', 'POST', {
        custom_collection: collectionData
      });
      console.log(`✅ Created collection: ${data.custom_collection.title}`);
      return data.custom_collection;
    } catch (error) {
      console.error('❌ Error creating collection:', error);
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
      console.error('❌ Error adding product to collection:', error);
      throw error;
    }
  }

  // Bulk Operations
  async bulkCreateProducts(products) {
    const results = [];
    console.log(`📦 Creating ${products.length} products...`);
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      try {
        console.log(`[${i + 1}/${products.length}] Creating: ${product.title}`);
        const createdProduct = await this.createProduct(product);
        results.push({ success: true, product: createdProduct });
        
        // Rate limiting - Shopify allows 2 requests per second for Plus stores
        await new Promise(resolve => setTimeout(resolve, 600));
      } catch (error) {
        console.error(`[${i + 1}/${products.length}] Failed: ${product.title}`, error.message);
        results.push({ success: false, product: product, error: error.message });
      }
    }
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`\n📊 Bulk Create Summary:`);
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    
    return results;
  }

  // Backup functions
  async backupProducts() {
    const products = await this.getProducts();
    const backupFile = `./data/backup-products-${Date.now()}.json`;
    
    fs.writeFileSync(backupFile, JSON.stringify(products, null, 2));
    console.log(`💾 Products backed up to: ${backupFile}`);
    return products;
  }

  async backupCollections() {
    const collections = await this.getCollections();
    const backupFile = `./data/backup-collections-${Date.now()}.json`;
    
    fs.writeFileSync(backupFile, JSON.stringify(collections, null, 2));
    console.log(`💾 Collections backed up to: ${backupFile}`);
    return collections;
  }
}

module.exports = ShopifyAPI;

// CLI usage
if (require.main === module) {
  const command = process.argv[2];
  const api = new ShopifyAPI();

  switch (command) {
    case 'test':
      api.testConnection();
      break;
      
    case 'products':
      api.getProducts().then(products => {
        console.log(`📦 Found ${products.length} products`);
        products.forEach(p => console.log(`  - ${p.title} (${p.variants.length} variants)`));
      });
      break;
      
    case 'collections':
      api.getCollections().then(collections => {
        console.log(`📁 Found ${collections.length} collections`);
        collections.forEach(c => console.log(`  - ${c.title}`));
      });
      break;
      
    case 'backup':
      Promise.all([
        api.backupProducts(),
        api.backupCollections()
      ]).then(() => console.log('✅ Backup complete'));
      break;
      
    default:
      console.log('Usage: node shopify-api.js [test|products|collections|backup]');
  }
}