import json

with open('scratch/curriculum_docs/منهاج_س3_شعب_علمية.doc.txt', 'r', encoding='utf-8') as f:
    text = f.read()

lines = []
for l in text.split('\n'):
    words = [w for w in l.split() if any('\u0600' <= c <= '\u06ff' for c in w)]
    if len(words) >= 2:
        lines.append(' '.join(words))

with open('scratch/curriculum_docs/s3_all_clean.txt', 'w', encoding='utf-8') as out:
    out.write('\n'.join(lines[100:]))

print("Total remaining lines:", len(lines) - 100)
