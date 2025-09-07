#!/usr/bin/env node

/**
 * Authentication Migration Script
 * 
 * This script helps identify and migrate existing code that uses manual token handling
 * to the new centralized authentication system.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Patterns to search for manual token handling
const patterns = [
  // Manual token retrieval
  {
    pattern: /localStorage\.getItem\(['"]token['"]\)/g,
    description: 'Manual token retrieval from localStorage',
    replacement: 'authService.getToken()',
    requiresImport: true
  },
  
  // Manual token setting
  {
    pattern: /localStorage\.setItem\(['"]token['"],\s*([^)]+)\)/g,
    description: 'Manual token setting in localStorage',
    replacement: 'authService.setToken($1)',
    requiresImport: true
  },
  
  // Manual token removal
  {
    pattern: /localStorage\.removeItem\(['"]token['"]\)/g,
    description: 'Manual token removal from localStorage',
    replacement: 'authService.setToken(null)',
    requiresImport: true
  },
  
  // Manual logout with localStorage
  {
    pattern: /localStorage\.removeItem\(['"]token['"]\);\s*window\.location\.href\s*=\s*['"]\/auth['"]/g,
    description: 'Manual logout with localStorage and redirect',
    replacement: 'authService.logout()',
    requiresImport: true
  },
  
  // Manual fetch with Authorization header
  {
    pattern: /fetch\([^)]*,\s*{\s*[^}]*headers:\s*{[^}]*['"]Authorization['"]:\s*['"]Bearer\s*\$\{token\}['"][^}]*}[^)]*\)/g,
    description: 'Manual fetch with Authorization header',
    replacement: 'fetchWithAuth($1)',
    requiresImport: true
  },
  
  // Manual Bearer token construction
  {
    pattern: /['"]Authorization['"]:\s*['"]Bearer\s*\$\{([^}]+)\}['"]/g,
    description: 'Manual Bearer token construction',
    replacement: '// Use fetchWithAuth instead of manual Authorization header',
    requiresImport: true
  }
];

// File extensions to process
const extensions = ['ts', 'tsx', 'js', 'jsx'];

// Directories to exclude
const excludeDirs = ['node_modules', 'dist', 'build', '.git', 'coverage'];

function findFiles() {
  const files = [];
  
  extensions.forEach(ext => {
    const pattern = `src/**/*.${ext}`;
    const matches = glob.sync(pattern, { ignore: excludeDirs.map(dir => `**/${dir}/**`) });
    files.push(...matches);
  });
  
  return files;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  patterns.forEach(({ pattern, description, replacement, requiresImport }) => {
    const matches = content.match(pattern);
    if (matches) {
      issues.push({
        description,
        matches: matches.length,
        replacement,
        requiresImport,
        pattern: pattern.toString()
      });
    }
  });
  
  return issues;
}

function generateMigrationReport() {
  console.log('🔍 Analyzing authentication patterns...\n');
  
  const files = findFiles();
  const report = {
    totalFiles: files.length,
    filesWithIssues: 0,
    totalIssues: 0,
    issues: []
  };
  
  files.forEach(filePath => {
    const issues = analyzeFile(filePath);
    if (issues.length > 0) {
      report.filesWithIssues++;
      report.totalIssues += issues.reduce((sum, issue) => sum + issue.matches, 0);
      
      report.issues.push({
        file: filePath,
        issues
      });
    }
  });
  
  return report;
}

function printReport(report) {
  console.log('📊 Authentication Migration Report\n');
  console.log(`Total files analyzed: ${report.totalFiles}`);
  console.log(`Files with issues: ${report.filesWithIssues}`);
  console.log(`Total issues found: ${report.totalIssues}\n`);
  
  if (report.issues.length === 0) {
    console.log('✅ No authentication issues found! Your code is already using the new system.');
    return;
  }
  
  console.log('🚨 Issues Found:\n');
  
  report.issues.forEach(({ file, issues }) => {
    console.log(`📁 ${file}`);
    issues.forEach(issue => {
      console.log(`  • ${issue.description}: ${issue.matches} occurrence(s)`);
      if (issue.requiresImport) {
        console.log(`    → Requires import: import { authService } from '@/utils/authService';`);
      }
      console.log(`    → Suggested replacement: ${issue.replacement}`);
    });
    console.log('');
  });
  
  console.log('📋 Migration Steps:');
  console.log('1. Add import: import { authService } from "@/utils/authService";');
  console.log('2. Replace manual token handling with authService methods');
  console.log('3. Replace manual fetch calls with fetchWithAuth utilities');
  console.log('4. Test authentication flow thoroughly');
  console.log('5. Remove any unused imports');
}

function generateMigrationScript(report) {
  if (report.issues.length === 0) {
    return;
  }
  
  console.log('\n🔧 Migration Script (run manually):\n');
  
  report.issues.forEach(({ file, issues }) => {
    console.log(`# ${file}`);
    
    // Check if file needs authService import
    const needsAuthServiceImport = issues.some(issue => issue.requiresImport);
    if (needsAuthServiceImport) {
      console.log(`# Add import: import { authService } from '@/utils/authService';`);
    }
    
    issues.forEach(issue => {
      console.log(`# Replace: ${issue.description}`);
      console.log(`# Pattern: ${issue.pattern}`);
      console.log(`# With: ${issue.replacement}`);
    });
    console.log('');
  });
}

// Main execution
if (require.main === module) {
  try {
    const report = generateMigrationReport();
    printReport(report);
    generateMigrationScript(report);
    
    console.log('\n💡 Tips:');
    console.log('• Use the useAuth hook for authentication state in React components');
    console.log('• Use fetchWithAuth utilities for all API calls');
    console.log('• The HTTP interceptor will handle most cases automatically');
    console.log('• Test thoroughly after migration');
    
  } catch (error) {
    console.error('❌ Error during analysis:', error.message);
    process.exit(1);
  }
}

module.exports = {
  findFiles,
  analyzeFile,
  generateMigrationReport
}; 