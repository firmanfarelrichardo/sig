const fs = require('fs');

const files = [
  'frontend/src/App.js',
  'frontend/src/components/SidebarControl.js',
  'frontend/src/components/StatsPanel.js'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Replace cyan-400, cyan-500, cyan-600 with orange equivalents
  content = content.replace(/text-cyan-400/g, 'text-orange-500');
  content = content.replace(/text-cyan-500/g, 'text-orange-500');
  content = content.replace(/bg-cyan-500/g, 'bg-orange-500');
  content = content.replace(/bg-cyan-600/g, 'bg-orange-600');
  content = content.replace(/border-cyan-500/g, 'border-orange-500');
  content = content.replace(/shadow-cyan-500/g, 'shadow-orange-500');
  content = content.replace(/hover:bg-cyan-500/g, 'hover:bg-orange-500');
  content = content.replace(/hover:text-cyan-400/g, 'hover:text-orange-500');
  content = content.replace(/from-cyan-400/g, 'from-orange-500');
  content = content.replace(/to-cyan-400/g, 'to-amber-500');
  
  // Emerald replacements if they are used as accents
  content = content.replace(/text-emerald-400/g, 'text-amber-500');
  content = content.replace(/bg-emerald-500/g, 'bg-amber-500');
  content = content.replace(/border-emerald-500/g, 'border-amber-500');

  fs.writeFileSync(file, content);
});

console.log("Colors replaced successfully!");
