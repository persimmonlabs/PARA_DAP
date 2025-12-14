const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
const publicDir = path.join(__dirname, '..', 'public');

async function convertIcons() {
  const conversions = [
    { input: 'icon-192.svg', output: 'icon-192.png', size: 192 },
    { input: 'icon-512.svg', output: 'icon-512.png', size: 512 },
    { input: 'icon-maskable.svg', output: 'icon-maskable.png', size: 512 },
    { input: 'apple-touch-icon.svg', output: 'apple-touch-icon.png', size: 180 },
  ];

  for (const { input, output, size } of conversions) {
    const inputPath = path.join(iconsDir, input);
    const outputPath = path.join(iconsDir, output);

    await sharp(inputPath)
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`Converted ${input} -> ${output}`);
  }

  // Convert favicon
  const faviconInput = path.join(publicDir, 'favicon.svg');
  const faviconOutput = path.join(publicDir, 'favicon.ico');

  await sharp(faviconInput)
    .resize(32, 32)
    .png()
    .toFile(faviconOutput);

  console.log('Converted favicon.svg -> favicon.ico');
  console.log('\nAll icons generated successfully!');
}

convertIcons().catch(console.error);
