import subprocess, sys
with open('/workspaces/hiswillguide/src/App.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
with open('/workspaces/hiswillguide/src/App.jsx', 'w', encoding='utf-8') as f:
    f.writelines(lines[:1011])
print(f'Trimmed from {len(lines)} lines to 1011 lines')
