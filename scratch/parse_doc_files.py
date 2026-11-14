import os
import re

def extract_strings_from_doc(doc_path):
    with open(doc_path, 'rb') as f:
        data = f.read()
    
    # Try UTF-16LE strings (standard in Word 97-2003 .doc)
    utf16_text = ""
    try:
        # Match sequences of utf-16le characters
        # Filter for Arabic range (0x0600 - 0x06FF) and ASCII
        chars = []
        for i in range(0, len(data) - 1, 2):
            code = data[i] | (data[i+1] << 8)
            if (0x0600 <= code <= 0x06FF) or (0x20 <= code <= 0x7E) or code in (10, 13, 9):
                chars.append(chr(code))
            else:
                if len(chars) > 4:
                    utf16_text += "".join(chars) + "\n"
                chars = []
        if len(chars) > 4:
            utf16_text += "".join(chars) + "\n"
    except Exception as e:
        print("Error utf16:", e)

    # Also try CP1256
    cp1256_text = ""
    try:
        raw_strings = re.findall(b'[\x20-\x7E\x80-\xFF]{4,}', data)
        for s in raw_strings:
            try:
                decoded = s.decode('cp1256')
                if any('\u0600' <= c <= '\u06ff' for c in decoded):
                    cp1256_text += decoded + "\n"
            except:
                pass
    except Exception as e:
        print("Error cp1256:", e)

    return utf16_text if len(utf16_text) > len(cp1256_text) else cp1256_text

doc_files = [
    'منهاج_س1_ثانوي.doc',
    'منهاج_س2_أدب_وفلسفة.doc',
    'منهاج_س2_علوم_ورياضيات.doc',
    'منهاج_س3_شعب_علمية.doc',
    'منهاج_س3_آداب_وفلسفة_ولغات.doc',
    'الوثيقة_المرافقة_س3_جميع_الشعب.doc'
]

for doc_name in doc_files:
    p = os.path.join('scratch', 'curriculum_docs', doc_name)
    txt = extract_strings_from_doc(p)
    out_p = os.path.join('scratch', 'curriculum_docs', doc_name + '.txt')
    with open(out_p, 'w', encoding='utf-8') as out:
        out.write(txt)
    print(f"Extracted {doc_name}: {len(txt)} chars")
    # Show first 5 lines containing Arabic
    arabic_lines = [l.strip() for l in txt.split('\n') if any('\u0600' <= c <= '\u06ff' for c in l)]
    print(f"  Arabic lines: {len(arabic_lines)}, Sample:")
    for l in arabic_lines[:5]:
        print("   *", l[:80])
