#!/usr/bin/env python3
import os
import re
import sys

ARTICLES_DIR = os.path.join(os.getcwd(), 'src/components/blog/articles')

def count_words(text):
    return len(re.findall(r'\b\w+\b', text))

# We will define a generator function or mapping that produces >500 words for each of the 58 articles
# Let us write out all 58 entries with exhaustive domain-specific prose!
