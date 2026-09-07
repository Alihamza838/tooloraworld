#!/usr/bin/env python3
import sys
import re

def count_words(text):
    return len(re.findall(r'\b\w+\b', text))

# Let us verify how an automated enrichment enhancer can guarantee every article has >= 520 words
# while maintaining 100% relevant domain-specific substance!
print("Enrichment enhancer engine ready.")
