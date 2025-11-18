/**
 * Script to extract KB articles from seed file and create markdown blog posts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Article data (extracted from seed-kb-articles.js)
const articles = [
  {
    slug: 'building-customer-relationships-packaging-industry',
    title: 'How to Build Strong Customer Relationships in Packaging',
    summary: 'Proven strategies for corrugated box manufacturers to win and retain packaging buyers through exceptional customer service.',
    content: `# How to Build Strong Customer Relationships in Packaging

Building lasting relationships with packaging buyers is the foundation of a successful corrugated box business. In a competitive market, technical expertise alone isn't enough—your customer relationships determine your growth.

## Understanding Your Packaging Buyers

### Types of Packaging Buyers
1. **E-commerce Companies** - Need consistent quality, fast turnaround
2. **FMCG Manufacturers** - Require bulk orders, strict specifications
3. **Export-Oriented Businesses** - Demand international standards, certifications
4. **Local Retailers** - Value flexibility, small batch capabilities

## Key Relationship-Building Strategies

### 1. Proactive Communication
- **Regular Check-ins**: Weekly updates on order status
- **Transparent Pricing**: No hidden costs or surprise charges
- **Technical Support**: Help customers choose right box specifications
- **Quality Reports**: Share test results (BCT, ECT, moisture content)

### 2. Understanding Customer Pain Points
Common challenges your buyers face:
- **Shipping Damage**: 18% of e-commerce returns are packaging-related
- **Cost Pressure**: Packaging is 5-10% of product cost
- **Inventory Management**: Balancing stock vs. storage costs
- **Regulatory Compliance**: GST, export documentation, certifications

### 3. Value-Added Services
Go beyond just selling boxes:
- **Free Design Consultation**: Help optimize box dimensions
- **Sample Provision**: Send prototypes before production
- **Inventory Management**: Offer JIT (Just-In-Time) delivery
- **Technical Training**: Educate buyers on packaging best practices

## Using Packwares CMS for Better Relationships

### Deal Pipeline Management
Track every customer interaction from first inquiry to repeat orders:
- **Lead Tracking**: Never miss a follow-up
- **Quote History**: Instant access to past pricing
- **Custom Pricing**: Set customer-specific rates
- **Order Tracking**: Real-time production status

### Customer Data Organization
Centralize all buyer information:
- **Contact Management**: Multiple contacts per customer
- **Communication History**: All emails, calls logged
- **Preferences**: Preferred payment terms, delivery schedules
- **Star Ratings**: Internal quality scoring

## Retaining Customers: The 90-Day Rule

Studies show customers who reorder within 90 days have 5x higher lifetime value.

### Follow-Up Schedule
- **Day 3**: Order delivery confirmation
- **Day 7**: Quality feedback request
- **Day 30**: Next order reminder
- **Day 60**: Share new designs or capabilities
- **Day 90**: Personalized outreach

## Handling Difficult Situations

### Late Deliveries
1. Inform customer immediately
2. Provide revised timeline
3. Offer compensation (discount, free samples)
4. Prevent recurrence with buffer time

### Quality Issues
1. Acknowledge problem quickly
2. Replace defective boxes at no cost
3. Investigate root cause
4. Share corrective action plan

### Payment Delays
1. Friendly reminder at 15 days overdue
2. Phone call at 30 days
3. Hold new orders at 45 days
4. Consider payment terms adjustment

## Metrics That Matter

Track these KPIs in Packwares CMS:
- **Repeat Order Rate**: Target >60%
- **Average Order Value**: Track growth trends
- **Payment Cycle**: Days to receive payment
- **Customer Satisfaction**: Post-delivery surveys

## Case Study: 40% Revenue Growth

A Pune-based converter using Packwares CMS increased revenue by 40% in 6 months by:
- Responding to quotes within 2 hours (was 24 hours)
- Following up systematically with lost deals
- Offering payment flexibility to top 10 customers
- Providing monthly consumption reports

## Action Steps

1. **Audit Current Relationships**: Score your top 20 customers
2. **Set Up CRM**: Use Packwares to centralize customer data
3. **Create Follow-Up Calendar**: Automate reminders
4. **Train Your Team**: Customer service best practices
5. **Measure Results**: Track retention monthly

## Related Articles
- [Managing Leads and Deals in Packaging](/knowledge-base/managing-leads-deals-packaging-industry)
- [Essential Guide to Box Costing](/knowledge-base/essential-guide-corrugated-box-costing)
- [Calculating Box Compression Strength](/knowledge-base/how-to-calculate-box-strength)

## Next Steps
Start tracking your customer relationships systematically with Packwares CMS. Our CRM module is designed specifically for corrugated box manufacturers—no generic features, just what you need.`,
    hook: 'Turn one-time buyers into lifelong partners with proven relationship-building strategies for the packaging industry.',
    category_id: 5,
    reading_time: '10 min',
    tags: ['CRM', 'customer relationships', 'packaging buyers', 'customer retention', 'sales strategy', 'corrugated business'],
    meta_description: 'Learn proven strategies to build strong, lasting relationships with packaging buyers. Practical CRM guide for corrugated box manufacturers.',
    author: 'Packwares Team'
  }
  // Additional articles would be added here from the complete list
];

// Function to parse tags from JSON.stringify format
function parseTags(tagsString) {
  try {
    return JSON.parse(tagsString);
  } catch (e) {
    console.error('Error parsing tags:', e);
    return [];
  }
}

// Function to create markdown frontmatter and content
function createMarkdownFile(article) {
  const tags = typeof article.tags === 'string' ? parseTags(article.tags) : article.tags;
  const categoryName = categoryMap[article.category_id] || 'General';

  const frontmatter = `---
layout: doc
title: ${article.title}
description: ${article.summary || article.meta_description}
date: 2025-01-15
author: ${article.author || 'Packwares Team'}
category: ${categoryName}
tags: ${JSON.stringify(tags)}
readingTime: ${article.reading_time}
---

`;

  return frontmatter + article.content;
}

// Main extraction function
async function extractArticles() {
  const outputDir = path.join(__dirname, 'blog', 'posts');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Starting article extraction...');
  console.log(`Output directory: ${outputDir}\n`);

  const results = [];

  for (const article of articles) {
    try {
      const markdown = createMarkdownFile(article);
      const filename = `${article.slug}.md`;
      const filepath = path.join(outputDir, filename);

      fs.writeFileSync(filepath, markdown, 'utf8');

      results.push({
        title: article.title,
        filename: filename,
        filepath: filepath,
        success: true
      });

      console.log(`✅ Created: ${filename}`);
    } catch (error) {
      results.push({
        title: article.title,
        filename: `${article.slug}.md`,
        success: false,
        error: error.message
      });

      console.error(`❌ Error creating ${article.slug}.md:`, error.message);
    }
  }

  // Generate summary
  console.log('\n' + '='.repeat(80));
  console.log('EXTRACTION SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total articles: ${articles.length}`);
  console.log(`Successfully created: ${results.filter(r => r.success).length}`);
  console.log(`Failed: ${results.filter(r => !r.success).length}`);

  if (results.filter(r => !r.success).length > 0) {
    console.log('\nFailed files:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.filename}: ${r.error}`);
    });
  }

  console.log('\nAll files saved to:', outputDir);

  return results;
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  extractArticles().catch(console.error);
}

export default extractArticles;
