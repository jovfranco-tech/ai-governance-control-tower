import fs from 'fs';
import path from 'path';

const SCAN_DIR = path.resolve('src');
const MOCK_SECRET_TEST = 'sk-abcdefghijklmnopqrstuvwxyz123456';

const SECRET_PATTERNS = [
  { name: 'OpenAI API Key', regex: /sk-[a-zA-Z0-9]{32,}/g },
  { name: 'Raw DB Connection String', regex: /postgres:\/\/[a-zA-Z0-9_]+:[a-zA-Z0-9_]+@/g },
  { name: 'Supabase Service Role Key (Raw)', regex: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9\-_]{50,}/g }
];

function scanDirectory(dir, issues = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDirectory(fullPath, issues);
    } else if (stat.isFile() && /\.(tsx|ts|js|jsx)$/.test(file)) {
      // Skip the test file where the mock secret scanner test resides
      if (file === 'ai.test.ts') continue;

      const content = fs.readFileSync(fullPath, 'utf8');
      
      for (const pattern of SECRET_PATTERNS) {
        let match;
        while ((match = pattern.regex.exec(content)) !== null) {
          // Verify it's not a generic placeholder
          if (match[0].includes('your-') || match[0].includes('placeholder')) continue;

          issues.push({
            file: path.relative(process.cwd(), fullPath),
            type: pattern.name,
            matched: match[0].slice(0, 12) + '...'
          });
        }
      }
    }
  }

  return issues;
}

console.log('========================================================================');
console.log('🔍 SECURE DEVS ECOPS: AUTOMATED SECRETS & CREDENTIALS SCANNER');
console.log('========================================================================');
console.log(`Scanning client-side assets in: ${path.relative(process.cwd(), SCAN_DIR)}`);

try {
  // 1. Verify .env is not in git index
  if (fs.existsSync('.env')) {
    const gitIgnoreContent = fs.readFileSync('.gitignore', 'utf8');
    if (!gitIgnoreContent.includes('.env')) {
      console.error('❌ CRITICAL SECURITY ERROR: .env is not ignored in .gitignore!');
      process.exit(1);
    }
  }

  // 2. Scan src/ directory
  const issues = scanDirectory(SCAN_DIR);

  if (issues.length > 0) {
    console.error(`\n❌ SECURE SCAN FAILED: Detected ${issues.length} potential raw credentials!`);
    console.table(issues);
    process.exit(1);
  } else {
    console.log('\n✅ SUCCESS: No client-side raw credentials or secrets detected in src/.');
    process.exit(0);
  }
} catch (error) {
  console.error('Error running security scanner:', error);
  process.exit(1);
}
