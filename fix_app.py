#!/usr/bin/env python3
import os

path = 'src/App.jsx'
lines = open(path, encoding='utf-8').readlines()
print(f'Total lines: {len(lines)}')
print(f'Line 1011: {repr(lines[1010])}')
print(f'Line 1012: {repr(lines[1011])}')
# Keep only up to line 1011 (index 1010, inclusive)
clean = lines[:1011]
open(path, 'w', encoding='utf-8').writelines(clean)
print(f'Written {len(clean)} lines')
print(f'Last line: {repr(clean[-1])}')
