#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const path = require('path');
const { URL } = require('url');

class EzinkImageExtractor {
  constructor() {
    this.baseUrl = 'https://ezink.co.za';
    this.imageDir = './data/images';
    this.productImages = {};
    
    // Product mapping based on our TEMPOINK products
    this.productMapping = {
      'geisha': {
        tempoinSku: 'TMIK-0002',
        tempoinTitle: 'Geisha',
        ezinkUrl: '/products/geisha'
      },
      'blazebone': {
        tempoinSku: 'TMIK-0003',
        tempoinTitle: 'Blazebone',
        ezinkUrl: '/products/blazebone'
      },
      'swooping-eagle': {
        tempoinSku: 'TMIK-0004',
        tempoinTitle: 'Swooping Eagle',
        ezinkUrl: '/products/swooping-eagle'
      },
      'balanced-soul': {
        tempoinSku: 'TMIK-0005',
        tempoinTitle: 'Balanced Soul',
        ezinkUrl: '/products/balanced-soul'
      },
      'viking-celtic': {
        tempoinSku: 'TMIK-0006',
        tempoinTitle: 'Viking Celtic',
        ezinkUrl: '/products/viking-celtic'
      },
      'fallen-angel': {
        tempoinSku: 'TMIK-0007',
        tempoinTitle: 'Fallen Angel',
        ezinkUrl: '/products/fallen-angel'
      },
      'knight': {
        tempoinSku: 'TMIK-0008',
        tempoinTitle: 'Knight',
        ezinkUrl: '/products/knight'
      },
      '3-sleeve-mystery-pack': {
        tempoinSku: 'TMIK-0009',
        tempoinTitle: '3 Sleeve Mystery Pack',
        ezinkUrl: '/products/3-sleeve-mystery-pack'
      },
      'japanese-dragon': {
        tempoinSku: 'TMIK-0001',
        tempoinTitle: 'Japanese Dragon Sleeve',
        ezinkUrl: '/products/japanese-dragon'
      },
      'japanese-waves-sleeve': {
        tempoinSku: 'TMIK-0010',
        tempoinTitle: 'Japanese Waves Sleeve',
        ezinkUrl: '/products/japanese-waves-sleeve'
      }
    };
  }

  makeRequest(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          }
        });
      }).on('error', (error) => {
        reject(error);
      });
    });
  }

  downloadImage(imageUrl, filename) {
    return new Promise((resolve, reject) => {
      // Ensure directory exists
      if (!fs.existsSync(this.imageDir)) {
        fs.mkdirSync(this.imageDir, { recursive: true });
      }

      const filePath = path.join(this.imageDir, filename);
      const file = fs.createWriteStream(filePath);

      https.get(imageUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download image: ${response.statusCode}`));
          return;
        }

        response.pipe(file);

        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${filename}`);
          resolve(filePath);
        });

        file.on('error', (err) => {
          fs.unlink(filePath, () => {}); // Delete the file on error
          reject(err);
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
  }

  extractImagesFromProductPage(html, productKey) {
    const images = [];
    
    // Extract all product images from the gallery
    // Look for image patterns in Shopify product pages
    const imagePatterns = [
      // Main product images
      /https:\/\/[^"]*cdn\.shopify\.com[^"]*\.(jpg|jpeg|png|webp)/gi,
      // Backup pattern for other CDN images
      /https:\/\/[^"]*\.(jpg|jpeg|png|webp)/gi
    ];

    for (const pattern of imagePatterns) {
      const matches = html.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // Filter out small icons and thumbnails
          if (!match.includes('icon') && 
              !match.includes('logo') && 
              !match.includes('_50x') && 
              !match.includes('_100x') &&
              !match.includes('_small')) {
            
            // Get high resolution version if possible
            const highResUrl = match
              .replace('_300x300', '_800x800')
              .replace('_400x400', '_800x800')
              .replace('_500x500', '_800x800')
              .replace('_medium', '_master')
              .replace('_large', '_master');
            
            if (!images.includes(highResUrl)) {
              images.push(highResUrl);
            }
          }
        });
      }
    }

    console.log(`📷 Found ${images.length} images for ${productKey}`);
    return images;
  }

  async extractProductImages(productKey, productInfo) {
    try {
      console.log(`\n🔍 Extracting images for: ${productInfo.tempoinTitle}`);
      
      const url = `${this.baseUrl}${productInfo.ezinkUrl}`;
      const html = await this.makeRequest(url);
      const images = this.extractImagesFromProductPage(html, productKey);
      
      const downloadedImages = [];
      
      for (let i = 0; i < images.length && i < 3; i++) { // Limit to 3 images per product
        const imageUrl = images[i];
        const extension = path.extname(new URL(imageUrl).pathname) || '.jpg';
        const filename = `${productInfo.tempoinSku}-${i + 1}${extension}`;
        
        try {
          const filePath = await this.downloadImage(imageUrl, filename);
          downloadedImages.push({
            url: imageUrl,
            filename: filename,
            localPath: filePath
          });
        } catch (error) {
          console.error(`❌ Failed to download image ${i + 1} for ${productKey}:`, error.message);
        }
      }

      this.productImages[productKey] = {
        ...productInfo,
        images: downloadedImages,
        extractedAt: new Date().toISOString()
      };

      console.log(`✅ Extracted ${downloadedImages.length} images for ${productInfo.tempoinTitle}`);
      return downloadedImages;

    } catch (error) {
      console.error(`❌ Error extracting images for ${productKey}:`, error.message);
      return [];
    }
  }

  async extractAllImages() {
    console.log('🚀 Starting image extraction from Ezink.co.za...\n');

    for (const [productKey, productInfo] of Object.entries(this.productMapping)) {
      await this.extractProductImages(productKey, productInfo);
      
      // Rate limiting - wait 2 seconds between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Save the extracted image data
    const outputFile = './data/extracted-images.json';
    fs.writeFileSync(outputFile, JSON.stringify(this.productImages, null, 2));
    
    console.log(`\n📊 Summary:`);
    console.log(`✅ Products processed: ${Object.keys(this.productImages).length}`);
    console.log(`📁 Images saved to: ${this.imageDir}`);
    console.log(`📄 Image data saved to: ${outputFile}`);

    return this.productImages;
  }

  async generateImageUpdateScript() {
    const scriptContent = `#!/usr/bin/env node

const ShopifyAPI = require('./shopify-api-simple');
const fs = require('fs');
const path = require('path');

class ImageUpdater {
  constructor() {
    this.api = new ShopifyAPI();
    this.imageData = JSON.parse(fs.readFileSync('./data/extracted-images.json', 'utf8'));
  }

  async updateProductImages() {
    console.log('🖼️  Starting product image updates...');
    
    const products = await this.api.getProducts();
    
    for (const [productKey, imageInfo] of Object.entries(this.imageData)) {
      const product = products.find(p => 
        p.variants.some(v => v.sku === imageInfo.tempoinSku)
      );
      
      if (product && imageInfo.images.length > 0) {
        console.log(\`📸 Updating images for: \${imageInfo.tempoinTitle}\`);
        
        // Here you would upload the images to Shopify
        // This requires additional API endpoints for image uploads
        console.log(\`  - \${imageInfo.images.length} images ready for upload\`);
        
        imageInfo.images.forEach((img, index) => {
          console.log(\`    \${index + 1}. \${img.filename}\`);
        });
      }
    }
  }
}

if (require.main === module) {
  const updater = new ImageUpdater();
  updater.updateProductImages()
    .then(() => console.log('✅ Image update process complete'))
    .catch(error => console.error('❌ Image update failed:', error));
}

module.exports = ImageUpdater;
`;

    fs.writeFileSync('./scripts/update-product-images.js', scriptContent);
    console.log('📝 Generated image update script: ./scripts/update-product-images.js');
  }
}

// CLI usage
if (require.main === module) {
  const extractor = new EzinkImageExtractor();
  
  extractor.extractAllImages()
    .then(async (results) => {
      console.log('\n🎉 Image extraction complete!');
      
      await extractor.generateImageUpdateScript();
      
      console.log('\n📝 Next steps:');
      console.log('  1. Review extracted images in ./data/images/');
      console.log('  2. Run: node scripts/update-product-images.js');
    })
    .catch(error => {
      console.error('💥 Extraction failed:', error.message);
      process.exit(1);
    });
}

module.exports = EzinkImageExtractor;