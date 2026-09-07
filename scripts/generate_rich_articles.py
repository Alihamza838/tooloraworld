#!/usr/bin/env python3
"""
scripts/generate_rich_articles.py
Defines tailored, exhaustive sections (>510 words) for all 58 articles
and updates the corresponding TypeScript files in src/components/blog/articles/.
"""
import os
import re
import sys

ARTICLES_DIR = os.path.join(os.getcwd(), 'src/components/blog/articles')

def count_words(text):
    return len(re.findall(r'\b\w+\b', text))

# A registry of rich article specifications.
ARTICLES_DICT = {}

def add_article(filename, sec1, sec2, sec3):
    total = count_words(sec1['content']) + count_words(sec2['content']) + count_words(sec3['content'])
    ARTICLES_DICT[filename] = [sec1, sec2, sec3]
    return total

print("Loading article definitions...")
