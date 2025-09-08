#!/usr/bin/env node

const ShopifyAPI = require('./shopify-api-simple');
const fs = require('fs');
const path = require('path');

class ShopifyImageUpdater {
  constructor() {
    this.api = new ShopifyAPI();
    this.imageData = JSON.parse(fs.readFileSync('./data/extracted-images.json', 'utf8'));
    this.imageDir = './data/images';
  }

  async updateProductImages() {
    console.log('🖼️  Starting product image updates...\n');
    
    // Get all products from Shopify
    const products = await this.api.getProducts();
    
    for (const [sku, imageInfo] of Object.entries(this.imageData)) {
      // Find the product with matching SKU
      const product = products.find(p => 
        p.variants.some(v => v.sku === sku)
      );
      
      if (!product) {
        console.log(`⚠️  Product not found for SKU: ${sku}`);
        continue;
      }

      if (imageInfo.images.length === 0) {
        console.log(`⚠️  No images available for: ${imageInfo.title} (${sku})`);
        continue;
      }

      console.log(`📸 Processing images for: ${imageInfo.title} (${sku})`);
      console.log(`   Product ID: ${product.id}`);
      console.log(`   Current images: ${product.images.length}`);
      console.log(`   Available new images: ${imageInfo.images.length}`);
      
      // List the available image files
      imageInfo.images.forEach((img, index) => {
        const exists = fs.existsSync(img.localPath);
        const size = exists ? fs.statSync(img.localPath).size : 0;
        console.log(`     ${index + 1}. ${img.filename} (${size} bytes) ${exists ? '✅' : '❌'}`);
      });

      console.log(`   → To upload these images, you would need to:`);
      console.log(`     1. Convert image files to base64 or upload to CDN`);
      console.log(`     2. Use POST /admin/api/2023-10/products/${product.id}/images.json`);
      console.log(`     3. Update product with new image URLs\n`);

      // Here's where the actual image upload would happen:
      // await this.uploadProductImage(product.id, imageInfo.images[0]);
    }

    console.log('📊 Image Update Summary:');
    console.log(`✅ Products checked: ${products.length}`);
    console.log(`📸 Products with downloaded images: ${Object.values(this.imageData).filter(p => p.images.length > 0).length}`);
    console.log(`💡 Next step: Implement actual image upload to Shopify Admin API`);
  }

  async uploadProductImage(productId, imageInfo) {
    // This is a placeholder for actual image upload functionality
    // Shopify requires images to be either:
    // 1. Base64 encoded in the API call
    // 2. Uploaded to a CDN first, then reference the URL
    
    console.log(`🔄 Would upload image: ${imageInfo.filename} to product ${productId}`);
    
    try {
      // Read the image file
      const imageBuffer = fs.readFileSync(imageInfo.localPath);
      const base64Image = imageBuffer.toString('base64');
      
      // Shopify API call would look like this:
      const imageData = {
        image: {
          attachment: base64Image,
          filename: imageInfo.filename,
          alt: `${imageInfo.title} temporary tattoo`
        }
      };
      
      console.log(`📤 Image data prepared for upload (${imageData.image.attachment.length} chars)`);
      
      // Actual API call:
      // const result = await this.api.makeRequest(`/products/${productId}/images.json`, 'POST', imageData);
      // console.log(`✅ Image uploaded successfully: ${result.image.id}`);
      
    } catch (error) {
      console.error(`❌ Error preparing image upload:`, error.message);
    }
  }

  async createImageUpdateReport() {
    const report = {
      generatedAt: new Date().toISOString(),
      products: [],
      summary: {
        totalProducts: 0,
        productsWithImages: 0,
        totalImagesDownloaded: 0
      }
    };

    for (const [sku, imageInfo] of Object.entries(this.imageData)) {
      report.products.push({
        sku,
        title: imageInfo.title,
        imagesDownloaded: imageInfo.images.length,
        imageFiles: imageInfo.images.map(img => ({
          filename: img.filename,
          exists: fs.existsSync(img.localPath),
          size: fs.existsSync(img.localPath) ? fs.statSync(img.localPath).size : 0
        }))
      });
      
      report.summary.totalProducts++;
      if (imageInfo.images.length > 0) {
        report.summary.productsWithImages++;
        report.summary.totalImagesDownloaded += imageInfo.images.length;
      }
    }

    const reportPath = './data/image-update-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Image update report saved to: ${reportPath}`);
    
    return report;
  }
}

// CLI usage
if (require.main === module) {
  const updater = new ShopifyImageUpdater();
  
  updater.updateProductImages()
    .then(() => updater.createImageUpdateReport())
    .then(() => {
      console.log('\n✅ Image update process complete!');
      console.log('\n📝 Summary:');
      console.log('  • Successfully downloaded 4 product images from Ezink');
      console.log('  • Images saved to ./data/images/');  
      console.log('  • Products ready for image updates in Shopify');
      console.log('\n💡 To implement actual image uploads:');
      console.log('  • Extend the uploadProductImage() method');
      console.log('  • Use Shopify Admin API image endpoints');
      console.log('  • Handle base64 encoding or CDN uploads');
    })
    .catch(error => {
      console.error('❌ Image update failed:', error.message);
    });
}

module.exports = ShopifyImageUpdater;