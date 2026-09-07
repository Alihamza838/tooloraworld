#!/usr/bin/env python3
import os
import re
import sys
import json

from enrichments_data_pdf import PDF_ARTICLES
from enrichments_data_images import IMAGE_ARTICLES
from enrichments_data_business import BUSINESS_ARTICLES
from enrichments_data_utils import UTILS_ARTICLES

ARTICLES_DIR = os.path.join(os.getcwd(), 'src/components/blog/articles')

def count_words(text):
    return len(re.findall(r'\b\w+\b', text))

# Merge all four dictionaries
ALL_ARTICLES = {}
ALL_ARTICLES.update(PDF_ARTICLES)
ALL_ARTICLES.update(IMAGE_ARTICLES)
ALL_ARTICLES.update(BUSINESS_ARTICLES)
ALL_ARTICLES.update(UTILS_ARTICLES)

print(f"Total articles registered in enrichment database: {len(ALL_ARTICLES)}")

# 1. Verification of word count for every single article
failing_articles = []
for filename, (sec1, sec2) in ALL_ARTICLES.items():
    words1 = count_words(sec1['content'])
    words2 = count_words(sec2['content'])
    total_words = words1 + words2
    if total_words < 500:
        failing_articles.append((filename, total_words))
    else:
        print(f"✓ {filename}: {total_words} words ({words1} + {words2})")

if failing_articles:
    print(f"ERROR: {len(failing_articles)} articles have under 500 words!")
    for f, cnt in failing_articles:
        print(f"  {f}: only {cnt} words")
    sys.exit(1)
else:
    print("\nALL 58 ARTICLES EXCEED 500 NEW WORDS MINIMUM REQUIREMENT!\n")

# 2. Check that all 58 target files exist in ARTICLES_DIR
missing_files = []
for filename in ALL_ARTICLES:
    filepath = os.path.join(ARTICLES_DIR, filename)
    if not os.path.isfile(filepath):
        missing_files.append(filename)

if missing_files:
    print(f"ERROR: {len(missing_files)} target files do not exist:")
    for mf in missing_files:
        print(f"  {mf}")
    sys.exit(1)
else:
    print("All 58 target .ts files verified to exist on disk.\n")

# 3. Apply enrichment to each file
applied_count = 0
skipped_count = 0

for filename, (sec1, sec2) in sorted(ALL_ARTICLES.items()):
    filepath = os.path.join(ARTICLES_DIR, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if section 1 ID is already in the file
    if sec1['id'] in content and sec2['id'] in content:
        print(f"Skipping {filename}: already contains enriched sections.")
        skipped_count += 1
        continue

    # Locate sections: [ array
    s_idx = content.find("sections: [")
    if s_idx == -1:
        print(f"Error: Could not find 'sections: [' in {filename}")
        sys.exit(1)

    depth = 1
    end_idx = -1
    in_string = False
    string_char = ""

    for i in range(s_idx + 11, len(content)):
        char = content[i]
        prev = content[i-1] if i > 0 else ""
        if in_string:
            if char == string_char and prev != "\\":
                in_string = False
        else:
            if char in ["`", "\"", "'"]:
                in_string = True
                string_char = char
            elif char == "[":
                depth += 1
            elif char == "]":
                depth -= 1
                if depth == 0:
                    end_idx = i
                    break

    if end_idx == -1:
        print(f"Error: Could not find closing bracket of sections array in {filename}")
        sys.exit(1)

    # Format the two new section blocks cleanly in TypeScript
    # Escaping backticks and ${} inside the content if any
    c1 = sec1['content'].replace('`', '\\`').replace('${', '\\${')
    c2 = sec2['content'].replace('`', '\\`').replace('${', '\\${')
    
    insertion = f""",
    {{
      id: "{sec1['id']}",
      heading: "{sec1['heading']}",
      content: `{c1}`
    }},
    {{
      id: "{sec2['id']}",
      heading: "{sec2['heading']}",
      content: `{c2}`
    }}"""

    new_content = content[:end_idx] + insertion + content[end_idx:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    applied_count += 1
    print(f"Successfully enriched {filename} (+{count_words(sec1['content']) + count_words(sec2['content'])} words)")

print(f"\nCompleted! Enriched: {applied_count}, Skipped: {skipped_count}, Total: {len(ALL_ARTICLES)}")
