import sys
import urllib.request
import urllib.parse
import json
import csv
import time

def fetch_pubmed(query):
    print(f"[*] Querying PubMed for: {query}")
    # URL-encode the user's query
    encoded_query = urllib.parse.quote(query)
    # Added &sort=date to force PubMed to return the most recent publications
    search_url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term={encoded_query}&retmode=json&retmax=200&sort=date"
    
    records = []
    try:
        req = urllib.request.Request(search_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            search_data = json.loads(response.read().decode())
        
        id_list = search_data.get('esearchresult', {}).get('idlist', [])
        print(f"    Found {len(id_list)} IDs on PubMed.")
        
        if not id_list:
            return []

        # esummary in batches of 100 to avoid URL length errors
        batch_size = 100
        for i in range(0, len(id_list), batch_size):
            batch_ids = id_list[i:i+batch_size]
            ids_str = ",".join(batch_ids)
            summary_url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id={ids_str}&retmode=json"
            
            req2 = urllib.request.Request(summary_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req2) as response_summ:
                summary_data = json.loads(response_summ.read().decode())
                
            for uid in batch_ids:
                if uid in summary_data.get('result', {}):
                    r = summary_data['result'][uid]
                    title = r.get('title', '')
                    pubdate = r.get('pubdate', '')
                    year = pubdate.split(' ')[0] if pubdate else ''
                    
                    doi = ''
                    for article_id in r.get('articleids', []):
                        if article_id.get('idtype') == 'doi':
                            doi = article_id.get('value')
                            break
                    if not doi:
                        eloc = r.get('elocationid', '')
                        if eloc.startswith('doi:'):
                            doi = eloc.replace('doi:', '').strip()
                    
                    if title:
                        # Clean up title artifacts like HTML tags sometimes present in pubmed titles
                        title = title.replace('<i>', '').replace('</i>', '').replace('<b>', '').replace('</b>', '')
                        records.append([title, doi, year])
                        
            # Sleep briefly to respect API limits
            time.sleep(0.5)
            
    except Exception as e:
        print(f"    [!] Error fetching from PubMed: {e}")
        
    return records

def fetch_scopus(query, api_key):
    print(f"[*] Querying Scopus for: {query}")
    # Scopus uses TITLE-ABS-KEY(query) to search title, abstract, and keywords
    scopus_query = f"TITLE-ABS-KEY({query})"
    encoded_query = urllib.parse.quote(scopus_query)
    
    headers = {
        "X-ELS-APIKey": api_key,
        "Accept": "application/json"
    }
    
    records = []
    try:
        # Fetch up to 200 results from Scopus using pagination (25 results per page)
        start = 0
        max_results = 200
        while start < max_results:
            # Added &sort=-coverDate for reverse chronological sorting
            url = f"https://api.elsevier.com/content/search/scopus?query={encoded_query}&count=25&start={start}&sort=-coverDate"
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode())
            
            entries = data.get('search-results', {}).get('entry', [])
            if not entries:
                break
                
            for article in entries:
                title = article.get('dc:title', '')
                doi = article.get('prism:doi', '')
                cover_date = article.get('prism:coverDate', '')
                year = cover_date.split('-')[0] if cover_date else ''
                
                if title:
                    records.append([title, doi, year])
                    
            start += 25
        print(f"    Found {len(records)} papers on Scopus.")
    except Exception as e:
        print(f"    [!] Error fetching from Scopus: {e}")
        
    return records

def update_csv(csv_file, new_records):
    existing_dois = set()
    existing_titles = set()
    
    # Read existing deduplication sets to ensure zero overlap
    try:
        with open(csv_file, "r", encoding="utf-8") as f:
            reader = csv.reader(f)
            headers = next(reader, None) # skip header
            for row in reader:
                if len(row) >= 2:
                    t = row[0].strip().lower()
                    d = row[1].strip()
                    if d: existing_dois.add(d)
                    if t: existing_titles.add(t)
    except FileNotFoundError:
        print(f"[*] Creating new file at {csv_file}")
        with open(csv_file, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["title", "doi", "year"])

    added_count = 0
    with open(csv_file, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        for row in new_records:
            t = row[0].strip().lower()
            d = row[1].strip()
            
            # Skip if DOI exists, or Title exactly matches an existing one
            if (d and d in existing_dois) or (t in existing_titles):
                continue
                
            writer.writerow(row)
            if d: existing_dois.add(d)
            existing_titles.add(t)
            added_count += 1
            
    print(f"[*] Successfully appended {added_count} new unique records to CSV (Duplicates ignored).")

def main():
    print("=============================================")
    print("   PubMed & Scopus Unified Paper Fetcher")
    print("=============================================")
    
    # Check if a query was passed via command line arguments
    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
        print(f"Using query: {query}")
    else:
        query = input("Enter your search query: ").strip()
        
    if not query:
        print("Query cannot be empty. Exiting.")
        return
        
    # User's API Key and Target CSV File
    api_key = "d5ab23e213d36b6d6ed306463072e475"
    csv_file = "/home/eofdred/Documents/5th/5th/template.csv"
    
    print("\n--- Starting Fetch Process ---")
    pubmed_records = fetch_pubmed(query)
    scopus_records = fetch_scopus(query, api_key)
    
    all_records = pubmed_records + scopus_records
    print(f"\n[*] Total combined raw papers retrieved: {len(all_records)}")
    
    if all_records:
        update_csv(csv_file, all_records)
    else:
        print("[*] No new papers found. CSV is unchanged.")

if __name__ == "__main__":
    main()
