#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const path = require('path');
const { URL } = require('url');

class BrowserImageExtractor {
  constructor() {
    this.imageDir = './data/images';
    this.productImages = {};
    
    // Manually extracted high-quality image URLs from browser inspection
    this.productImageUrls = {
      'TMIK-0002': { // Geisha
        title: 'Geisha',
        images: [
          'https://ezink.co.za/cdn/shop/files/GeishaTemporaryTattoo.jpg?v=1751823928&width=1946',
          'https://ezink.co.za/cdn/shop/files/Geishatemporarytattoo_1.png?v=1751823928&width=1946',
          'https://ezink.co.za/cdn/shop/files/beforeandafter_4372aee4-4130-4297-9c4d-742d9ab29972.png?v=1751823928&width=1946'
        ]
      },
      'TMIK-0001': { // Japanese Dragon Sleeve
        title: 'Japanese Dragon Sleeve',
        images: [
          'https://ezink.co.za/cdn/shop/files/DragonSleeve3.jpg?v=1645776577&width=1946',
          'https://ezink.co.za/cdn/shop/files/DragonSleeveBefore_After.png?v=1645776577&width=1946'
        ]
      },
      'TMIK-0003': { // Blazebone
        title: 'Blazebone',
        images: [
          'https://ezink.co.za/cdn/shop/files/DSC_1473.jpg?v=1710842648&width=1946',
          'https://ezink.co.za/cdn/shop/files/DSC_1479.jpg?v=1710842648&width=1946'
        ]
      },
      'TMIK-0004': { // Swooping Eagle
        title: 'Swooping Eagle',
        images: [
          'https://ezink.co.za/cdn/shop/files/DSC_1505.jpg?v=1710842720&width=1946',
          'https://ezink.co.za/cdn/shop/files/DSC_1512.jpg?v=1710842720&width=1946'
        ]
      },
      'TMIK-0005': { // Balanced Soul
        title: 'Balanced Soul',  
        images: [
          'https://ezink.co.za/cdn/shop/files/DSC_1533.jpg?v=1710842823&width=1946',
          'https://ezink.co.za/cdn/shop/files/DSC_1540.jpg?v=1710842823&width=1946'
        ]
      },
      'TMIK-0006': { // Viking Celtic
        title: 'Viking Celtic',
        images: [
          'https://ezink.co.za/cdn/shop/files/vikingceltictemporarytattoo.jpg?v=1645776658&width=1946',
          'https://ezink.co.za/cdn/shop/files/vikingceltictemporarytattoobefore_after.png?v=1645776658&width=1946'
        ]
      },
      'TMIK-0007': { // Fallen Angel
        title: 'Fallen Angel',
        images: [
          'https://ezink.co.za/cdn/shop/files/FallenAngelTemporaryTattoo.jpg?v=1645776696&width=1946',
          'https://ezink.co.za/cdn/shop/files/fallenangelbefore_after.png?v=1645776696&width=1946'
        ]
      },
      'TMIK-0008': { // Knight
        title: 'Knight',
        images: [
          'https://ezink.co.za/cdn/shop/files/KnightTemporaryTattoo.jpg?v=1645776764&width=1946',
          'https://ezink.co.za/cdn/shop/files/knightbefore_after.png?v=1645776764&width=1946'
        ]
      },
      'TMIK-0009': { // 3 Sleeve Mystery Pack
        title: '3 Sleeve Mystery Pack',
        images: [
          'https://ezink.co.za/cdn/shop/files/3SleeveMysteryPack.png?v=1645776787&width=1946',
          'https://ezink.co.za/cdn/shop/files/3SleeveMysteryPackBeforeAfter.png?v=1645776787&width=1946'
        ]
      },
      'TMIK-0010': { // Japanese Waves Sleeve
        title: 'Japanese Waves Sleeve',
        images: [
          'https://ezink.co.za/cdn/shop/files/JapaneseWavesSleeve.jpg?v=1645776817&width=1946',
          'https://ezink.co.za/cdn/shop/files/japanwavessleevebefore_after.png?v=1645776817&width=1946'
        ]
      }
    };
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

  async downloadAllImages() {
    console.log('🚀 Starting image download from Ezink.co.za...\n');

    for (const [sku, productInfo] of Object.entries(this.productImageUrls)) {
      console.log(`📸 Downloading images for: ${productInfo.title} (${sku})`);
      
      const downloadedImages = [];
      
      for (let i = 0; i < productInfo.images.length; i++) {
        const imageUrl = productInfo.images[i];
        const extension = path.extname(new URL(imageUrl).pathname) || '.jpg';
        const filename = `${sku}-${i + 1}${extension}`;
        
        try {
          const filePath = await this.downloadImage(imageUrl, filename);
          downloadedImages.push({
            url: imageUrl,
            filename: filename,
            localPath: filePath
          });
        } catch (error) {
          console.error(`❌ Failed to download image ${i + 1} for ${sku}:`, error.message);
        }
      }

      this.productImages[sku] = {
        ...productInfo,
        images: downloadedImages,
        extractedAt: new Date().toISOString()
      };

      console.log(`✅ Downloaded ${downloadedImages.length} images for ${productInfo.title}\n`);
      
      // Rate limiting - wait 1 second between products
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Save the extracted image data
    const outputFile = './data/extracted-images.json';
    fs.writeFileSync(outputFile, JSON.stringify(this.productImages, null, 2));
    
    console.log(`📊 Summary:`);
    console.log(`✅ Products processed: ${Object.keys(this.productImages).length}`);
    console.log(`📁 Images saved to: ${this.imageDir}`);
    console.log(`📄 Image data saved to: ${outputFile}`);

    return this.productImages;
  }
}

// CLI usage
if (require.main === module) {
  const extractor = new BrowserImageExtractor();
  
  extractor.downloadAllImages()
    .then((results) => {
      console.log('\n🎉 Image download complete!');
      console.log('\n📝 Next steps:');
      console.log('  1. Review downloaded images in ./data/images/');
      console.log('  2. Run: node scripts/update-shopify-images.js');
    })
    .catch(error => {
      console.error('💥 Download failed:', error.message);
      process.exit(1);
    });
}

module.exports = BrowserImageExtractor;