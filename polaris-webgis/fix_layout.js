const fs = require('fs');

const fixLayout = (file) => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove absolute h-screen from Sidebar and StatsPanel to let them flex naturally
  content = content.replace(/h-screen/g, 'h-full');
  content = content.replace(/min-h-\[100vh\]/g, 'h-full');
  content = content.replace(/border-r /g, ' ');
  content = content.replace(/border-l /g, ' ');
  
  fs.writeFileSync(file, content);
};

['frontend/src/components/SidebarControl.js', 'frontend/src/components/StatsPanel.js'].forEach(fixLayout);
