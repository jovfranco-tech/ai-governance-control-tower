import fs from 'fs';
import path from 'path';

// Target directories for complete coverage
const SCAN_DIRS = [
  'src',
  'api',
  'supabase/functions',
  'scripts',
  '.github',
  'docs'
];

// Patterns for likely real secrets and API credentials
const SECRET_PATTERNS = [
  { name: 'OpenAI API Key', regex: /sk-(proj-)?[a-zA-Z0-9]{24,}/g },
  { name: 'Raw DB Connection String', regex: /postgres(ql)?:\/\/[a-zA-Z0-9_\-]+:[a-zA-Z0-9_\-]+@/g },
  { name: 'Supabase Service Role Key (Raw)', regex: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9\-_]{50,}/g },
  { name: 'Stripe Secret Key', regex: /sk_(live|test)_[a-zA-Z0-9]{20,}/g },
  { name: 'Stripe Webhook Secret', regex: /whsec_[a-zA-Z0-9]{20,}/g }
];

// Safe placeholder terms to avoid false positives in templates/examples
const SAFE_PLACEHOLDERS = [
  'your-',
  'placeholder',
  'example',
  'dummy',
  'mock',
  'replace_with_',
  'abcdefghijklmnopqrstuvwxyz',
  'your-anon-key-here',
  'your-service-role-secret-key-here',
  'your-openai-api-key-here',
  'your-stripe-secret-key-here',
  'your-stripe-webhook-verification-secret-here'
];

function isSafe(matchedString) {
  const normalized = matchedString.toLowerCase();
  return SAFE_PLACEHOLDERS.some(placeholder => normalized.includes(placeholder));
}

function scanDirectory(dir, issues = []) {
  if (!fs.existsSync(dir)) return issues;
  
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Avoid traversing inside known large or local node dependencies
      if (['node_modules', 'dist', 'build', '.git', 'coverage', '.vercel'].includes(file)) continue;
      scanDirectory(fullPath, issues);
    } else if (stat.isFile() && /\.(tsx|ts|js|jsx|yml|yaml|md|json)$/.test(file)) {
      // Skip the test files where mock keys or scanner tests are designed
      if (file === 'ai.test.ts' || file === 'security-secrets-scan.js') continue;

      const content = fs.readFileSync(fullPath, 'utf8');
      
      for (const pattern of SECRET_PATTERNS) {
        let match;
        // Reset regex index for safety
        pattern.regex.lastIndex = 0;
        
        while ((match = pattern.regex.exec(content)) !== null) {
          if (isSafe(match[0])) continue;

          issues.push({
            file: path.relative(process.cwd(), fullPath),
            type: pattern.name,
            matched: match[0].slice(0, 15) + '...'
          });
        }
      }
    }
  }

  return issues;
}

console.log('========================================================================');
console.log('🔍 SECURE DEVSECOPS: AUTOMATED SECRETS & CREDENTIALS SCANNER (v2.2.0)');
console.log('========================================================================');

let allIssues = [];
for (const scanDir of SCAN_DIRS) {
  const dirPath = path.resolve(scanDir);
  if (fs.existsSync(dirPath)) {
    console.log(`Scanning: ${scanDir}/`);
    scanDirectory(dirPath, allIssues);
  }
}

try {
  // 1. Verify .env is not in git index
  if (fs.existsSync('.env')) {
    const gitIgnoreContent = fs.readFileSync('.gitignore', 'utf8');
    if (!gitIgnoreContent.includes('.env')) {
      console.error('\n❌ CRITICAL SECURITY ERROR: .env is not ignored in .gitignore!');
      process.exit(1);
    }
  }

  if (allIssues.length > 0) {
    console.error(`\n❌ SECURE SCAN FAILED: Detected ${allIssues.length} potential raw credentials!`);
    console.table(allIssues);
    process.exit(1);
  } else {
    console.log('\n✅ SUCCESS: No client-side or backend raw credentials detected in scanned directories.');
    process.exit(0);
  }
} catch (error) {
  console.error('Error running security scanner:', error);
  process.exit(1);
}
