const fs = require('fs');

const transformToLight = (file) => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace dark classes with light classes
  content = content.replace(/bg-slate-900/g, 'bg-white');
  content = content.replace(/bg-slate-800/g, 'bg-slate-50');
  content = content.replace(/bg-slate-950/g, 'bg-slate-100');
  content = content.replace(/text-white/g, 'text-slate-800');
  content = content.replace(/text-slate-300/g, 'text-slate-600');
  content = content.replace(/text-slate-400/g, 'text-slate-500');
  content = content.replace(/border-slate-800/g, 'border-slate-200');
  content = content.replace(/border-slate-700/g, 'border-slate-200');
  content = content.replace(/border-slate-600/g, 'border-slate-300');
  content = content.replace(/shadow-cyan-500\/20/g, 'shadow-orange-500/10');
  content = content.replace(/shadow-orange-500\/20/g, 'shadow-orange-500/10');
  
  // Special for MapCanvasEnhanced
  if (file.includes('MapCanvasEnhanced.js')) {
    content = content.replace(/url="https:\/\/{s}\.tile\.openstreetmap\.org\/{z}\/{x}\/{y}\.png"/g, 'url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"');
    content = content.replace(/linear-gradient\(135deg, #06b6d4 0%, #0891b2 100%\)/g, 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)');
    content = content.replace(/rgba\(6, 182, 212, 0\.6\)/g, 'rgba(245, 158, 11, 0.6)');
    content = content.replace(/rgba\(6, 182, 212, 0\.3\)/g, 'rgba(245, 158, 11, 0.3)');
  }

  fs.writeFileSync(file, content);
};

['frontend/src/components/SidebarControl.js', 'frontend/src/components/StatsPanel.js', 'frontend/src/components/MapCanvasEnhanced.js'].forEach(transformToLight);

console.log("Light theme transformation complete.");
