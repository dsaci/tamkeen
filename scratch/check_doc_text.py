import json

with open('scratch/curriculum_docs/منهاج_س3_شعب_علمية.doc.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Filter lines that have more than 3 Arabic words
lines = []
for l in text.split('\n'):
    words = [w for w in l.split() if any('\u0600' <= c <= '\u06ff' for c in w)]
    if len(words) >= 3:
        lines.append(' '.join(words))

print(f"Meaningful Arabic lines: {len(lines)}")
with open('scratch/curriculum_docs/s3_sample_clean.txt', 'w', encoding='utf-8') as out:
    out.write('\n'.join(lines[:100]))

print("Sample saved to scratch/curriculum_docs/s3_sample_clean.txt")
