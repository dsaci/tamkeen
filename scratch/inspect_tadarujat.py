import os

files = [
    'scratch/س1 - ج م أ + ج م ع ت .pdf.txt',
    'scratch/س2 - الشعب العلمية المشتركة .pdf.txt',
    'scratch/س2 - آ ف +ل أ.pdf.txt',
    'scratch/س3 - الشعب العلمية المشتركة.pdf.txt',
    'scratch/س3 - آ ف + ل أ.pdf.txt'
]

for f in files:
    print("="*50)
    print("FILE:", os.path.basename(f))
    with open(f, 'r', encoding='utf-8') as infile:
        content = infile.read()
    lines = [l.strip() for l in content.split('\n') if l.strip()]
    print(f"Total lines: {len(lines)}")
    # Print first 25 non-empty lines
    for l in lines[:25]:
        print("  ", l)
