#!/usr/bin/env python3
import sys
import re

def count_words(text):
    return len(re.findall(r'\b\w+\b', text))

print("Helper ready.")
