#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');
require('dotenv').config();

class MediaSync {
  constructor() {
    this.domain = process.env.SHOPIFY_DOMAIN;
    this.accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    this.themeId = process.env.SHOPIFY_THEME_ID;
    this.mediaDir = './data/media';
    this.baseUrl = `https://${this.domain}/admin/api/2023-10`;
    
    if (!fs.existsSync(this.mediaDir)) {
      fs.mkdirSync(this.mediaDir, { recursive: true });
    }
  }

  async uploadToTheme(filePath, assetKey) {
    const fileBuffer = fs.readFileSync(filePath);
    const base64 = fileBuffer.toString('base64');
    
    const response = await fetch(`${this.baseUrl}/themes/${this.themeId}/assets.json`, {
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': this.accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        asset: {
          key: assetKey,
          attachment: base64
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  async uploadMediaFiles() {
    const mediaFiles = fs.readdirSync(this.mediaDir);
    const results = [];

    for (const file of mediaFiles) {
      if (file.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
        const filePath = path.join(this.mediaDir, file);
        const assetKey = `assets/${file}`;
        
        try {
          const result = await this.uploadToTheme(filePath, assetKey);
          console.log(`✅ Uploaded: ${file}`);
          results.push({ file, success: true, assetKey });
        } catch (error) {
          console.error(`❌ Failed to upload ${file}:`, error.message);
          results.push({ file, success: false, error: error.message });
        }
      }
    }

    // Save upload log
    const logPath = './data/media-upload-log.json';
    fs.writeFileSync(logPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      results
    }, null, 2));

    return results;
  }

  async downloadThemeAssets() {
    const response = await fetch(`${this.baseUrl}/themes/${this.themeId}/assets.json`, {
      headers: {
        'X-Shopify-Access-Token': this.accessToken
      }
    });

    const data = await response.json();
    const imageAssets = data.assets.filter(asset => 
      asset.key.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)
    );

    for (const asset of imageAssets) {
      const assetResponse = await fetch(`${this.baseUrl}/themes/${this.themeId}/assets.json?asset[key]=${asset.key}`, {
        headers: {
          'X-Shopify-Access-Token': this.accessToken
        }
      });
      
      const assetData = await assetResponse.json();
      if (assetData.asset.attachment) {
        const buffer = Buffer.from(assetData.asset.attachment, 'base64');
        const fileName = path.basename(asset.key);
        const filePath = path.join(this.mediaDir, fileName);
        
        fs.writeFileSync(filePath, buffer);
        console.log(`📥 Downloaded: ${fileName}`);
      }
    }
  }
}

// CLI usage
if (require.main === module) {
  const command = process.argv[2];
  const mediaSync = new MediaSync();

  switch (command) {
    case 'upload':
      mediaSync.uploadMediaFiles()
        .then(results => {
          console.log(`\n📊 Upload Summary:`);
          console.log(`Successful: ${results.filter(r => r.success).length}`);
          console.log(`Failed: ${results.filter(r => !r.success).length}`);
        })
        .catch(console.error);
      break;
      
    case 'download':
      mediaSync.downloadThemeAssets()
        .then(() => console.log('✅ Download complete'))
        .catch(console.error);
      break;
      
    default:
      console.log('Usage: node sync-media.js [upload|download]');
  }
}

module.exports = MediaSync;