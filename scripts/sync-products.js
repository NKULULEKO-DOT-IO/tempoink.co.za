// Product sync script using Shopify Admin API
const fs = require('fs');
const fetch = require('node-fetch');

const SHOPIFY_DOMAIN = 'chcfjk-dc.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

class ShopifySync {
  constructor() {
    this.baseUrl = `https://${SHOPIFY_DOMAIN}/admin/api/2023-10/`;
    this.headers = {
      'X-Shopify-Access-Token': ACCESS_TOKEN,
      'Content-Type': 'application/json'
    };
  }

  // Export products to local JSON
  async exportProducts() {
    const response = await fetch(`${this.baseUrl}products.json`, {
      headers: this.headers
    });
    const data = await response.json();
    
    fs.writeFileSync('./data/products.json', JSON.stringify(data.products, null, 2));
    console.log(`Exported ${data.products.length} products`);
  }

  // Import products from local JSON
  async importProducts() {
    const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));
    
    for (const product of products) {
      const response = await fetch(`${this.baseUrl}products.json`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ product })
      });
      
      if (response.ok) {
        console.log(`Created product: ${product.title}`);
      }
    }
  }

  // Sync media files
  async uploadMedia(filePath, altText = '') {
    const formData = new FormData();
    formData.append('asset[file]', fs.createReadStream(filePath));
    formData.append('asset[alt]', altText);

    const response = await fetch(`${this.baseUrl}themes/${THEME_ID}/assets.json`, {
      method: 'PUT',
      headers: { 'X-Shopify-Access-Token': ACCESS_TOKEN },
      body: formData
    });

    return response.json();
  }
}

module.exports = ShopifySync;