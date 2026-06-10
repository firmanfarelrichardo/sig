const fs = require('fs');

const fixContrast = (file) => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Fix low contrast elements
  content = content.replace(/bg-slate-800\/50/g, 'bg-slate-50 border border-slate-200');
  content = content.replace(/bg-slate-900\/50/g, 'bg-slate-100 border border-slate-200');
  content = content.replace(/bg-slate-800/g, 'bg-slate-50 border border-slate-200');
  content = content.replace(/bg-slate-900/g, 'bg-white');
  content = content.replace(/text-slate-300/g, 'text-slate-600');
  content = content.replace(/text-slate-400/g, 'text-slate-500');
  content = content.replace(/border-slate-700/g, 'border-slate-200');
  
  fs.writeFileSync(file, content);
};

['frontend/src/components/SidebarControl.js', 'frontend/src/components/StatsPanel.js'].forEach(fixContrast);
