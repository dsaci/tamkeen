import pypdf
import os
import glob
import json

base_dir = r"scratch\tadarujat_unzipped\تدرجات 2022 اللغة العربية وآدابها"
pdf_files = glob.glob(os.path.join(base_dir, "**", "*.pdf"), recursive=True)

results = {}

for pdf_path in pdf_files:
    fname = os.path.basename(pdf_path)
    print(f"Reading: {fname}")
    reader = pypdf.PdfReader(pdf_path)
    text = ""
    for idx, page in enumerate(reader.pages):
        page_text = page.extract_text() or ""
        text += f"\n--- PAGE {idx+1} ---\n" + page_text
    results[fname] = {
        "path": pdf_path,
        "pages_count": len(reader.pages),
        "sample": text[:3000],
        "full_text_len": len(text)
    }
    with open(f"scratch/{fname}.txt", "w", encoding="utf-8") as out:
        out.write(text)

print("Done! Extracted all texts to scratch/*.txt")
