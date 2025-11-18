import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the articles
const { default: seedKBArticles } = await import('./seed-kb-articles.js');

// Read the seed file to extract articles
const seedContent = fs.readFileSync('./seed-kb-articles.js', 'utf8');

// Category mapping
const categoryMap = {
  1: 'Box Strength',
  2: 'Box Costing',
  3: 'Inventory Management',
  4: 'Production Optimization',
  5: 'Customer Relationship Management',
  6: 'Sales & Marketing',
  7: 'Team Management',
  8: 'Business Management',
  9: 'Technology'
};

// Missing slugs
const missingSlugs = [
  'sustainable-packaging-solutions-corrugated-manufacturing',
  'food-safe-corrugated-packaging-guide',
  'ecommerce-packaging-optimization-guide',
  'corrugated-vs-cardboard-complete-comparison',
  'corrugated-box-manufacturing-automation-guide',
  'custom-printed-corrugated-boxes-branding-roi',
  'what-is-cms-guide-for-packaging-sourcing-professionals'
];

// Extract articles from the content
const articles = [];
const articleMatches = [...seedContent.matchAll(/{\s*slug:\s*['"]([^'"]+)['"]/g)];

for (const match of articleMatches) {
  const slug = match[1];
  if (missingSlugs.includes(slug)) {
    // Find the article object
    const articleStart = match.index;
    let articleEnd = articleStart;
    let braceCount = 0;
    let inString = false;
    let stringChar = '';

    for (let i = articleStart; i < seedContent.length; i++) {
      const char = seedContent[i];
      const prevChar = i > 0 ? seedContent[i-1] : '';

      if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
        }
      }

      if (!inString) {
        if (char === '{') braceCount++;
        if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            articleEnd = i + 1;
            break;
          }
        }
      }
    }

    const articleText = seedContent.substring(articleStart, articleEnd);

    // Parse article properties
    const article = {};

    // Extract slug
    const slugMatch = articleText.match(/slug:\s*['"]([^'"]+)['"]/);
    if (slugMatch) article.slug = slugMatch[1];

    // Extract title
    const titleMatch = articleText.match(/title:\s*['"]([^'"]+)['"]/);
    if (titleMatch) article.title = titleMatch[1];

    // Extract summary
    const summaryMatch = articleText.match(/summary:\s*['"]([^'"]+)['"]/);
    if (summaryMatch) article.summary = summaryMatch[1];

    // Extract content (with backticks)
    const contentMatch = articleText.match(/content:\s*`([\s\S]*?)`,?\s*(?:hook:|category_id:)/);
    if (contentMatch) article.content = contentMatch[1];

    // Extract category_id
    const catMatch = articleText.match(/category_id:\s*(\d+)/);
    if (catMatch) article.category_id = parseInt(catMatch[1]);

    // Extract reading_time
    const timeMatch = articleText.match(/reading_time:\s*['"]([^'"]+)['"]/);
    if (timeMatch) article.reading_time = timeMatch[1];

    // Extract tags
    const tagsMatch = articleText.match(/tags:\s*JSON\.stringify\((\[[^\]]+\])\)/);
    if (tagsMatch) {
      try {
        article.tags = JSON.parse(tagsMatch[1].replace(/'/g, '"'));
      } catch (e) {
        article.tags = [];
      }
    }

    // Extract meta_description
    const metaMatch = articleText.match(/meta_description:\s*['"]([^'"]+)['"]/);
    if (metaMatch) article.meta_description = metaMatch[1];

    // Extract author
    const authorMatch = articleText.match(/author:\s*['"]([^'"]+)['"]/);
    article.author = authorMatch ? authorMatch[1] : 'Packwares Team';

    if (article.content) {
      articles.push(article);
    }
  }
}

// Create markdown files
const outputDir = path.join(__dirname, 'blog', 'posts');

console.log(`Found ${articles.length} missing articles\n`);
console.log('Creating markdown files...\n');

for (const article of articles) {
  const categoryName = categoryMap[article.category_id] || 'General';
  const tags = article.tags || [];

  const frontmatter = `---
layout: doc
title: ${article.title}
description: ${article.summary || article.meta_description || ''}
date: 2025-01-15
author: ${article.author}
category: ${categoryName}
tags: ${JSON.stringify(tags)}
readingTime: ${article.reading_time || '10 min'}
---

`;

  const content = frontmatter + article.content;
  const filename = `${article.slug}.md`;
  const filepath = path.join(outputDir, filename);

  try {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`✅ Created: ${filename}`);
  } catch (error) {
    console.error(`❌ Error creating ${filename}:`, error.message);
  }
}

console.log(`\nCompleted! Created ${articles.length} articles.`);
