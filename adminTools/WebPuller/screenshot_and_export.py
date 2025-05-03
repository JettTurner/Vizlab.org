import os
import time
import csv
import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urlparse
from datetime import datetime
from threading import Lock  # NEW

# --------------------------
# Timestamp-based output folder setup
# --------------------------
timestamp_str = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
BASE_OUTPUT_FOLDER = os.path.join('outputs', timestamp_str)
SCREENSHOT_FOLDER = os.path.join(BASE_OUTPUT_FOLDER, 'screenshots')
JS_OUTPUT_FILE = os.path.join(BASE_OUTPUT_FOLDER, 'resources.js')
PROCESSED_URLS_FILE = os.path.join(BASE_OUTPUT_FOLDER, 'processed_urls.txt')

# Create necessary folders if they don't exist
os.makedirs(SCREENSHOT_FOLDER, exist_ok=True)

# --------------------------
# Chrome driver setup
# --------------------------
chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--window-size=875,875")
chrome_driver_path = 'chromedriver.exe'

def initialize_driver():
    # Create a new Chrome driver instance
    service = Service(chrome_driver_path)
    driver = webdriver.Chrome(service=service, options=chrome_options)
    return driver

def extract_domain_name(url):
    # Return the domain from a URL
    try:
        parsed_url = urlparse(url)
        return parsed_url.netloc
    except:
        return None

def normalize_multi_value_field(raw, mapping=None):
    """
    Normalize and split comma-separated values from input, applying optional mapping.
    If no mapping is provided, just split and strip.
    """
    raw_clean = raw.replace(" ", "").lower()
    values = []

    if mapping:
        for key, label in mapping.items():
            if key in raw_clean:
                values.append(label)
    else:
        # Default behavior: split by commas and clean
        values = [item.replace(" ", "") for item in raw.split(",") if item.replace(" ", "")]

    # Fallback if nothing matched
    if not values:
        values = [raw.replace(" ", "")]

    return values

# --------------------------
# Function to capture screenshot and build JS object
# --------------------------
def capture_screenshot_and_build_js(unique_id, timestamp, url, name, description, categories, price, tag, subtag, software):
    driver = initialize_driver()
    try:
        # Navigate to the URL
        try:
            driver.get(url)
        except Exception as e:
            print(f"⚠️ Error loading {url}: {e}")
            return None  # Skip this entry
        time.sleep(4)  # Wait for the page to load 2 is standard

        # Set zoom to 50% for smaller screenshots
        driver.execute_script("document.body.style.zoom='50%'")

        # Fallback name using domain if blank
        if not name.strip():
            name = extract_domain_name(url)

        # Create screenshot filename and capture image
        screenshot_filename = f"{name}_{unique_id}.png"
        screenshot_file_path = os.path.join(SCREENSHOT_FOLDER, screenshot_filename)
        driver.save_screenshot(screenshot_file_path)

        # Normalize all multi-value fields
        price_map = {
            "free": "Free",
            "onetimepayment": "OneTimePurchase",
            "recurringorsubscription": "Subscription"
        }
        category_map = {
            "education/tutorial": "Education",
            "assets/tools": "Assets",
            "reference/": "Reference",
            "documentation": "Documentation",
            "gettingstarted(idealresourcesforbeginners)": "GettingStarted",
        }

        normalized_price = normalize_multi_value_field(price, price_map)
        normalized_category = normalize_multi_value_field(categories, category_map)
        normalized_tag = normalize_multi_value_field(tag)
        normalized_subtag = normalize_multi_value_field(subtag)
        normalized_software = normalize_multi_value_field(software)

        # Construct resource dictionary
        resource = {
            "title": name,
            "description": description,
            "href": url,
            "image": f"/src/lib/assets/{screenshot_filename}",
            "category": normalized_category,
            "tag": normalized_tag,
            "subtag": normalized_subtag,
            "software": normalized_software,
            "price": normalized_price,
            "color": None,
            "score": None,
            "date curated": timestamp,
            "id": unique_id,
        }

        return resource
    finally:
        driver.quit()

# --------------------------
# Initialize processed URL tracking
# --------------------------
processed_urls = set()

# Input CSV file to process
CSV_FILE = 'websites.csv'
resources = []

# NEW: Progress tracking setup
progress_lock = Lock()
progress_count = 0
total_count = 0

# NEW: Progress-tracking wrapper
def wrapped_capture(*args, **kwargs):
    global progress_count
    result = capture_screenshot_and_build_js(*args, **kwargs)
    with progress_lock:
        progress_count += 1
        percent = (progress_count / total_count) * 100
        print(f"🧪 Progress: {progress_count}/{total_count} ({percent:.1f}%)")
    return result

# --------------------------
# Process CSV and launch threads for each entry
# --------------------------
with open(CSV_FILE, newline='', encoding='utf-8') as csvfile:
    reader = list(csv.DictReader(csvfile))  # NEW: Convert to list to get length
    total_count = len(reader)               # NEW: Store total count

    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = []
        for idx, row in enumerate(reader):
            url = row['URL:']

            if url in processed_urls:
                print(f"⏭️  Skipping {url} (already processed)")
                continue

            # Parse and format timestamp
            input_str = row['Timestamp']
            dt = datetime.strptime(input_str, "%m/%d/%Y %H:%M:%S")
            formatted_date = dt.strftime("%d/%m/%Y")

            # Extract row fields
            name = row['Resource Name']
            description = row['Description of site']
            price = row['Is this resource Free? One Time Payment? Subscription? We need to know.']
            categories = row['What Major Category does it belong to?']
            tag = row['Tag (Main Discipline or Type category)']
            subtag = row['Sub-Tag (Minor Discipline or Type category)']
            software = row['What software is it for / compatible with?']

            unique_id = f"{idx+1:04d}"

            # Submit to thread pool
            futures.append(executor.submit(
                wrapped_capture,  # <- NEW: use wrapped version
                unique_id, formatted_date, url, name, description,
                categories, price, tag, subtag, software
            ))
            processed_urls.add(url)

        # Collect results
        for future in futures:
            result = future.result()
            if result:
                resources.append(result)

# --------------------------
# Write resources.js file
# --------------------------
with open(JS_OUTPUT_FILE, 'w', encoding='utf-8') as jsfile:
    jsfile.write("const resources = [\n")
    for res in resources:
        jsfile.write(f"    {json.dumps(res, indent=4)},\n")
    jsfile.write("];\n")

# --------------------------
# Write processed URLs log
# --------------------------
with open(PROCESSED_URLS_FILE, 'w', encoding='utf-8') as file:
    file.write("\n".join(processed_urls))

# --------------------------
# Done!
# --------------------------
print(f"\n✅ Done. Outputs saved to: {BASE_OUTPUT_FOLDER}")
