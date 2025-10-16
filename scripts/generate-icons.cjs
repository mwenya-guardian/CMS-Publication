const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
const createIcon = (size) => {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#10b981" rx="${size * 0.1}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.3}" font-weight="bold" text-anchor="middle" dy="0.35em" fill="white">CMS</text>
  </svg>`;
};

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate icons
const sizes = [192, 512];
sizes.forEach(size => {
  const iconPath = path.join(publicDir, `pwa-${size}x${size}.png`);
  const svgContent = createIcon(size);
  
  // For now, we'll create SVG files instead of PNG
  // In production, you'd want to convert these to PNG using a tool like sharp
  const svgPath = path.join(publicDir, `pwa-${size}x${size}.svg`);
  fs.writeFileSync(svgPath, svgContent);
  
  console.log(`Generated icon: pwa-${size}x${size}.svg`);
});

console.log('PWA icons generated successfully!');
console.log('Note: For production, convert SVG files to PNG format using tools like sharp or imagemagick.');
