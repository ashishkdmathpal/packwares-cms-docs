#!/usr/bin/env python3
"""
Extract all 25 KB articles from seed file and create markdown blog posts
"""

import json
import re
import os
from pathlib import Path

# Category mapping
CATEGORY_MAP = {
    1: 'Box Strength',
    2: 'Box Costing',
    3: 'Inventory Management',
    4: 'Production Optimization',
    5: 'Customer Relationship Management',
    6: 'Sales & Marketing',
    7: 'Team Management',
    8: 'Business Management',
    9: 'Technology'
}

def extract_articles_from_seed(seed_file_path):
    """Read the seed file and extract all articles"""
    with open(seed_file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the allArticles array
    match = re.search(r'const allArticles = \[(.*?)\];', content, re.DOTALL)
    if not match:
        print("Could not find allArticles array in seed file")
        return []

    articles_text = match.group(1)

    # Split by article objects (looking for pattern: {\n    slug:)
    article_blocks = re.split(r'},\s*{', articles_text)

    articles = []
    for i, block in enumerate(article_blocks):
        # Clean up the block
        if not block.strip().startswith('slug:'):
            block = '{' + block
        if not block.strip().endswith('}'):
            block = block + '}'

        try:
            article = parse_article_block(block)
            if article:
                articles.append(article)
                print(f"Extracted article {len(articles)}: {article.get('title', 'Unknown')}")
        except Exception as e:
            print(f"Error parsing article block {i+1}: {e}")
            continue

    return articles

def parse_article_block(block):
    """Parse a single article object from JavaScript"""
    article = {}

    # Extract slug
    slug_match = re.search(r'slug:\s*[\'"]([^\'"]+)[\'"]', block)
    if slug_match:
        article['slug'] = slug_match.group(1)

    # Extract title
    title_match = re.search(r'title:\s*[\'"]([^\'"]+)[\'"]', block)
    if title_match:
        article['title'] = title_match.group(1)

    # Extract summary
    summary_match = re.search(r'summary:\s*[\'"]([^\'"]+)[\'"]', block)
    if summary_match:
        article['summary'] = summary_match.group(1)

    # Extract content (handles backticks)
    content_match = re.search(r'content:\s*`([^`]*(?:`(?!,\s*hook:)[^`]*)*)`', block, re.DOTALL)
    if content_match:
        article['content'] = content_match.group(1)

    # Extract hook
    hook_match = re.search(r'hook:\s*[\'"]([^\'"]+)[\'"]', block)
    if hook_match:
        article['hook'] = hook_match.group(1)

    # Extract category_id
    cat_match = re.search(r'category_id:\s*(\d+)', block)
    if cat_match:
        article['category_id'] = int(cat_match.group(1))

    # Extract reading_time
    time_match = re.search(r'reading_time:\s*[\'"]([^\'"]+)[\'"]', block)
    if time_match:
        article['reading_time'] = time_match.group(1)

    # Extract tags (JSON.stringify format)
    tags_match = re.search(r'tags:\s*JSON\.stringify\((\[[^\]]+\])\)', block)
    if tags_match:
        try:
            # Clean up and parse the array
            tags_str = tags_match.group(1).replace("'", '"')
            article['tags'] = json.loads(tags_str)
        except:
            article['tags'] = []

    # Extract meta_description
    meta_match = re.search(r'meta_description:\s*[\'"]([^\'"]+)[\'"]', block)
    if meta_match:
        article['meta_description'] = meta_match.group(1)

    # Extract author
    author_match = re.search(r'author:\s*[\'"]([^\'"]+)[\'"]', block)
    if author_match:
        article['author'] = author_match.group(1)
    else:
        article['author'] = 'Packwares Team'

    return article if 'slug' in article and 'content' in article else None

def create_markdown_file(article, output_dir):
    """Create markdown file with frontmatter"""
    category_name = CATEGORY_MAP.get(article.get('category_id', 8), 'General')
    tags = article.get('tags', [])

    frontmatter = f"""---
layout: doc
title: {article.get('title', 'Untitled')}
description: {article.get('summary') or article.get('meta_description', '')}
date: 2025-01-15
author: {article.get('author', 'Packwares Team')}
category: {category_name}
tags: {json.dumps(tags)}
readingTime: {article.get('reading_time', '10 min')}
---

"""

    content = frontmatter + article.get('content', '')

    filename = f"{article['slug']}.md"
    filepath = output_dir / filename

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    return filepath

def main():
    # Set up paths
    project_root = Path(__file__).parent
    seed_file = project_root / 'seed-kb-articles.js'
    output_dir = project_root / 'blog' / 'posts'

    # Create output directory
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"Reading seed file: {seed_file}")
    print(f"Output directory: {output_dir}\n")

    # Extract articles
    articles = extract_articles_from_seed(seed_file)

    if not articles:
        print("No articles found!")
        return

    print(f"\nExtracted {len(articles)} articles\n")
    print("="*80)
    print("Creating markdown files...")
    print("="*80 + "\n")

    # Create markdown files
    results = []
    for i, article in enumerate(articles, 1):
        try:
            filepath = create_markdown_file(article, output_dir)
            results.append({
                'title': article.get('title'),
                'filename': filepath.name,
                'filepath': str(filepath),
                'success': True
            })
            print(f"✅ {i:2d}. Created: {filepath.name}")
        except Exception as e:
            results.append({
                'title': article.get('title', 'Unknown'),
                'filename': f"{article.get('slug', 'unknown')}.md",
                'success': False,
                'error': str(e)
            })
            print(f"❌ {i:2d}. Error: {article.get('slug', 'unknown')}.md - {e}")

    # Print summary
    print("\n" + "="*80)
    print("EXTRACTION SUMMARY")
    print("="*80)
    print(f"Total articles found: {len(articles)}")
    print(f"Successfully created: {sum(1 for r in results if r['success'])}")
    print(f"Failed: {sum(1 for r in results if not r['success'])}")

    if any(not r['success'] for r in results):
        print("\nFailed files:")
        for r in results:
            if not r['success']:
                print(f"  - {r['filename']}: {r.get('error', 'Unknown error')}")

    print(f"\nAll files saved to: {output_dir}")

    # Create a summary file
    summary_file = output_dir.parent / 'extraction_summary.txt'
    with open(summary_file, 'w', encoding='utf-8') as f:
        f.write("EXTRACTION SUMMARY\n")
        f.write("="*80 + "\n\n")
        f.write(f"Total articles extracted: {len(articles)}\n")
        f.write(f"Successfully created: {sum(1 for r in results if r['success'])}\n\n")
        f.write("List of all articles:\n")
        f.write("-"*80 + "\n")
        for i, r in enumerate(results, 1):
            status = "✅" if r['success'] else "❌"
            f.write(f"{i:2d}. {status} {r['title']}\n")
            f.write(f"    File: {r['filename']}\n")
            if not r['success']:
                f.write(f"    Error: {r.get('error', 'Unknown')}\n")
            f.write("\n")

    print(f"\nDetailed summary saved to: {summary_file}")

if __name__ == '__main__':
    main()
