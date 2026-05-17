const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // If file imports from demoData
  if (content.includes('../data/demoData')) {
    // Replace import with DataContext
    content = content.replace(/import {([^}]+)} from '\.\.\/data\/demoData';/g, "import { useDataContext } from '../contexts/DataContext';");
    
    // Check what was extracted. Usually it's like "useCases, risks, controls"
    // So we just inject "const { useCases, risks ... } = useDataContext();" inside the component
    
    // Find component declaration
    const compMatch = content.match(/const\s+([A-Z][a-zA-Z0-9_]*)\s*=\s*\([^)]*\)\s*=>\s*{/);
    if (compMatch) {
      // Find the variables that were previously imported from demoData by looking at the file before replacing
      const oldContent = fs.readFileSync(filePath, 'utf-8');
      const importMatch = oldContent.match(/import {([^}]+)} from '\.\.\/data\/demoData';/);
      if (importMatch && !content.includes('useDataContext();')) {
        const vars = importMatch[1].trim();
        const injection = `\n  const { ${vars} } = useDataContext();`;
        content = content.replace(compMatch[0], compMatch[0] + injection);
      }
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});
