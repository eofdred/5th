# MAKÜ News Logger (Simple Version)

A simple tool to fetch news from MAKÜ and view it in a nice HTML format.

## How to use:

### Step 1: Sync the News
Run the script in your terminal to fetch the latest updates:
```bash
python3 ~/news_logger/news_logger.py
```

### Step 2: View the News
Open **`index.html`** in any web browser (Chrome, Firefox, etc.) to see the news in a clean RSS-style layout.

---

## Files in this folder:
- `news_logger.py`: The script that fetches and saves news.
- `index.html`: Your visual news reader.
- `news_db.json`: The database of all news found so far.
- `news_data.js`: A temporary file created by the script so the HTML can show the news.
- `news_log.txt`: A simple text log of all "new" items found.
