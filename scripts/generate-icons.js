const fs = require('fs');
const path = require('path');

// Simple SVG to generate icons
const generateSVG = (size, isPWAIcon = false) => {
  const padding = isPWAIcon ? size * 0.2 : size * 0.15;
  const checkSize = size - (padding * 2);
  const strokeWidth = Math.max(2, size / 20);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#E07A3D"/>
  <g transform="translate(${padding}, ${padding})">
    <path d="M ${checkSize * 0.2} ${checkSize * 0.5} L ${checkSize * 0.4} ${checkSize * 0.7} L ${checkSize * 0.8} ${checkSize * 0.3}"
          stroke="white"
          stroke-width="${strokeWidth}"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"/>
  </g>
</svg>`;
};

// Generate favicon ICO (simplified - just save as PNG)
const generateFavicon = () => {
  return generateSVG(32, false);
};

const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Create directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG files (we'll save as .svg for now, would need a library to convert to PNG)
const icons = [
  { name: 'icon-192.svg', size: 192, isPWA: true },
  { name: 'icon-512.svg', size: 512, isPWA: true },
  { name: 'icon-maskable.svg', size: 512, isPWA: true },
  { name: 'apple-touch-icon.svg', size: 180, isPWA: false },
];

icons.forEach(({ name, size, isPWA }) => {
  const svg = generateSVG(size, isPWA);
  fs.writeFileSync(path.join(iconsDir, name), svg);
  console.log(`Generated ${name}`);
});

// Generate favicon
const faviconSVG = generateFavicon();
fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.svg'), faviconSVG);
console.log('Generated favicon.svg');

console.log('\nNote: SVG files generated. For production, convert these to PNG using a tool like:');
console.log('npm install -g sharp-cli');
console.log('sharp -i icon-192.svg -o icon-192.png');
console.log('\nOr use an online converter like https://cloudconvert.com/svg-to-png');
