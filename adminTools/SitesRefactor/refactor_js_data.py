import os
import json
import re
from datetime import datetime

input_file = 'sites.js'  # Replace with actual file path
output_dir_base = 'outputs'
output_filename = 'sitesrefactor.js'

# Prepare output path
timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
output_dir = os.path.join(output_dir_base, timestamp)
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, output_filename)

# Helper: Remove JS-style comments
def remove_js_comments(code):
    result = []
    in_string = False
    in_single_line_comment = False
    in_multi_line_comment = False
    string_char = ''

    i = 0
    while i < len(code):
        char = code[i]
        next_char = code[i + 1] if i + 1 < len(code) else ''

        if in_single_line_comment:
            if char == '\n':
                in_single_line_comment = False
                result.append(char)
        elif in_multi_line_comment:
            if char == '*' and next_char == '/':
                in_multi_line_comment = False
                i += 1  # Skip '/'
        elif in_string:
            result.append(char)
            if char == '\\':  # Escape next char
                i += 1
                if i < len(code):
                    result.append(code[i])
            elif char == string_char:
                in_string = False
        else:
            if char == '/' and next_char == '/':
                in_single_line_comment = True
                i += 1  # Skip second '/'
            elif char == '/' and next_char == '*':
                in_multi_line_comment = True
                i += 1  # Skip '*'
            elif char in ('"', "'"):
                in_string = True
                string_char = char
                result.append(char)
            else:
                result.append(char)
        i += 1

    return ''.join(result)


# Read and preprocess
with open(input_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove variable declarations like "const data = ..."
content = re.sub(r'^\s*const\s+\w+\s*=\s*', '', content)

# Remove JS-style comments
content = remove_js_comments(content)

# Find all object-like blocks using regex (assumes top-level objects)
object_matches = re.findall(r'\{[\s\S]*?\}', content)

# Clean and fix each object
cleaned_objects = []
for obj in object_matches:
    # Remove trailing commas before closing brackets/braces
    obj = re.sub(r',(\s*[}\]])', r'\1', obj)
    try:
        cleaned_objects.append(json.loads(obj))
    except json.JSONDecodeError as e:
        print("Failed to parse one object. Skipping...")
        print(obj)
        continue

# Refactor each entry
refactored_data = []
for idx, entry in enumerate(cleaned_objects, start=1):
    # Check if the 'id' field exists, otherwise assign a new one
    if 'id' not in entry:
        entry['id'] = f"{idx:04d}"  # Assign a unique ID if not already present

    # Check if 'date curated' exists, otherwise default to '2/23/2025'
    if 'date curated' not in entry:
        entry['date curated'] = '02/23/2025'

    # Create the new entry with the appropriate fields
    new_entry = {
        "title": entry.get("title", "Untitled"),
        "description": entry.get("description", ""),
        "href": entry.get("href", ""),
        "image": entry.get("image", ""),
        "category": entry.get("category", []),
        "tag": entry.get("tags", []),
        "subtag": entry.get("subtags", []),
        "software": entry.get("software", []),
        "price": entry.get("price") if isinstance(entry.get("price"), list) else ([entry.get("price")] if entry.get("price") else []),
        "color": entry.get("color", None),
        "score": entry.get("score", None),
        "date curated": entry['date curated'],  # Use the existing or default date
        # Use the ID from the entry (either the existing one or the new one assigned)
        "id": entry['id']
    }
    refactored_data.append(new_entry)

# Wrap it as a JS variable
js_output = "export const links = " + json.dumps(refactored_data, indent=4) + ";\n"

# Write to output
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(js_output)

print(f"✅ Refactored data saved to {output_path}")


