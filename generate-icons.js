const fs = require('fs');
const { createCanvas } = require('canvas');

// Icon sizes defined in manifest.json
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Function to generate a simple icon
function generateIcon(size) {
  // Create canvas with the required dimensions
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Fill background with dark color
  ctx.fillStyle = '#1F2937';
  ctx.fillRect(0, 0, size, size);
  
  // Draw a simple "P" letter
  ctx.fillStyle = '#8B5CF6';
  ctx.font = `bold ${size * 0.6}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('P', size / 2, size / 2);
  
  // Add a border
  ctx.strokeStyle = '#8B5CF6';
  ctx.lineWidth = size * 0.03;
  ctx.strokeRect(size * 0.1, size * 0.1, size * 0.8, size * 0.8);
  
  // Convert canvas to buffer
  return canvas.toBuffer('image/png');
}

// Create the icons directory if it doesn't exist
if (!fs.existsSync('./public/icons')) {
  fs.mkdirSync('./public/icons', { recursive: true });
}

// Generate icons for each size
sizes.forEach(size => {
  const iconBuffer = generateIcon(size);
  const filePath = `./public/icons/icon-${size}x${size}.png`;
  
  fs.writeFileSync(filePath, iconBuffer);
  console.log(`Generated: ${filePath}`);
});

console.log('All icons generated successfully!'); 