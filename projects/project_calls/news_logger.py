#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import json
import os
from datetime import datetime
import re

# Configuration - Relative to script location for portability
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(SCRIPT_DIR, "news_db.json")
LOG_FILE = os.path.join(SCRIPT_DIR, "news_log.txt")
JS_FILE = os.path.join(SCRIPT_DIR, "news_data.js")

SOURCES = {
    "MAKU": {
        "name": "MAKÜ",
        "url": "https://depo.mehmetakif.edu.tr/api/v1/front/mehmetakif.edu.tr/tr/contents/35/1/-?page=1",
        "base_url": "https://mehmetakif.edu.tr/tr/content/",
        "color": "#003366"
    },
    "TUBITAK": {
        "name": "TÜBİTAK",
        "url": "https://tubitak.gov.tr/tr/duyuru",
        "base_url": "https://tubitak.gov.tr",
        "color": "#1a1a1a"
    },
    "UA": {
        "name": "Ulusal Ajans",
        "url": "https://www.ua.gov.tr/haber/",
        "base_url": "https://www.ua.gov.tr",
        "color": "#d9534f"
    }
}

MONTHS_TR = {
    "Oca": "01", "Şub": "02", "Mar": "03", "Nis": "04", "May": "05", "Haz": "06",
    "Tem": "07", "Ağu": "08", "Eyl": "09", "Eki": "10", "Kas": "11", "Ara": "12"
}

def normalize_date(date_str, source):
    try:
        if source == "MAKU":
            return date_str
        elif source == "UA":
            d, m, y = date_str.split('.')
            return f"{y}-{m}-{d} 00:00:00"
        elif source == "TUBITAK":
            parts = date_str.split()
            if len(parts) >= 3:
                day = parts[0].zfill(2)
                month = MONTHS_TR.get(parts[1][:3], "01")
                year = parts[2]
                return f"{year}-{month}-{day} 00:00:00"
    except:
        pass
    return "0000-00-00 00:00:00"

def fetch_maku():
    items = []
    try:
        r = requests.get(SOURCES["MAKU"]["url"], timeout=15)
        data = r.json()
        for layout in data.get('layouts', []):
            if 'contents' in layout.get('data', {}):
                for item in layout['data']['contents'].get('data', []):
                    datas = item.get('datas', [])
                    if datas:
                        trans = datas[0]
                        raw_date = item.get('doing_at', '0000-00-00 00:00:00')
                        items.append({
                            'id': f"maku_{item['id']}",
                            'title': trans.get('title', '').strip(),
                            'link': f"{SOURCES['MAKU']['base_url']}{item['id']}/{trans.get('slug', '')}",
                            'date': normalize_date(raw_date, "MAKU"),
                            'display_date': raw_date,
                            'source': 'MAKU'
                        })
    except Exception as e: print(f"Error MAKU: {e}")
    return items

def fetch_tubitak():
    items = []
    try:
        r = requests.get(SOURCES["TUBITAK"]["url"], timeout=15)
        soup = BeautifulSoup(r.text, 'html.parser')
        rows = soup.select('div.views-row')
        for row in rows:
            title_tag = row.select_one('.views-field-title a')
            date_tag = row.select_one('.views-field-created')
            if title_tag:
                link = title_tag['href']
                if not link.startswith('http'): link = SOURCES["TUBITAK"]["base_url"] + link
                raw_date = date_tag.text.strip() if date_tag else ""
                items.append({
                    'id': f"tubitak_{link.split('/')[-1]}",
                    'title': title_tag.text.strip(),
                    'link': link,
                    'date': normalize_date(raw_date, "TUBITAK"),
                    'display_date': raw_date,
                    'source': 'TUBITAK'
                })
    except Exception as e: print(f"Error TUBITAK: {e}")
    return items

def fetch_ua():
    items = []
    try:
        r = requests.get(SOURCES["UA"]["url"], timeout=15)
        soup = BeautifulSoup(r.text, 'html.parser')
        containers = soup.select('div.news-container')
        for container in containers:
            title_tag = container.select_one('h1.content-title')
            link_tag = container.find('a', href=True)
            date_tag = container.select_one('span.more-date')
            if title_tag and link_tag:
                link = link_tag['href']
                if not link.startswith('http'): link = SOURCES["UA"]["base_url"] + link
                item_id = f"ua_{link.split('/')[-2] if link.endswith('/') else link.split('/')[-1]}"
                raw_date = date_tag.text.strip() if date_tag else ""
                items.append({
                    'id': item_id,
                    'title': title_tag.text.strip(),
                    'link': link,
                    'date': normalize_date(raw_date, "UA"),
                    'display_date': raw_date,
                    'source': 'UA'
                })
    except Exception as e: print(f"Error UA: {e}")
    return items

def load_db():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            try: return json.load(f)
            except: return []
    return []

def save_db(db):
    with open(DB_FILE, 'w', encoding='utf-8') as f:
        json.dump(db, f, ensure_ascii=False, indent=4)
    with open(JS_FILE, 'w', encoding='utf-8') as f:
        data = {
            "sources": SOURCES, 
            "news": sorted(db, key=lambda x: x.get('date', ''), reverse=True),
            "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        f.write(f"const newsData = {json.dumps(data, ensure_ascii=False)};")

def main():
    print("Syncing all sources...")
    db = load_db()
    seen_ids = {str(item['id']): item for item in db}
    
    current_news = fetch_maku() + fetch_tubitak() + fetch_ua()
    
    updated_db = []
    new_count = 0
    processed_ids = set()

    for item in current_news:
        item_id = str(item['id'])
        if item_id in processed_ids: continue
        processed_ids.add(item_id)

        if item_id not in seen_ids:
            item['read'] = False
            updated_db.append(item)
            new_count += 1
            with open(LOG_FILE, 'a', encoding='utf-8') as f:
                f.write(f"[{datetime.now()}] NEW ({item['source']}): {item['title']}\n")
        else:
            existing = seen_ids[item_id]
            item['read'] = existing.get('read', False)
            updated_db.append(item)

    for old_id, old_item in seen_ids.items():
        if old_id not in processed_ids:
            updated_db.append(old_item)

    save_db(updated_db)
    print(f"Done. {new_count} new items found. Total database size: {len(updated_db)} items.")

if __name__ == "__main__":
    main()
