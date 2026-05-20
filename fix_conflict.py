import os
import sys

file_path = "src/components/Analytics.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
in_head = False
in_update = False

for line in lines:
    if line.startswith("<<<<<<< HEAD"):
        in_head = True
        continue
    if line.startswith("======="):
        in_head = False
        in_update = True
        continue
    if line.startswith(">>>>>>> 027e143"):
        in_update = False
        continue
    
    if in_head:
        # We skip HEAD side
        continue
    
    # We keep update side and normal lines
    new_lines.append(line)

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Conflicts resolved!")
