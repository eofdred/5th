import csv
import sys

def remove_duplicates(input_file, output_file):
    print(f"Reading from {input_file}...")
    seen_dois = set()
    seen_titles = set()
    unique_rows = []
    
    try:
        with open(input_file, "r", encoding="utf-8") as fin:
            reader = csv.reader(fin)
            header = next(reader, None)
            if header:
                unique_rows.append(header)
                
            total_read = 0
            for row in reader:
                if len(row) >= 2:
                    total_read += 1
                    # Clean up for comparison
                    title = row[0].strip().lower()
                    doi = row[1].strip()
                    
                    # Exact deduplication check
                    if (doi and doi in seen_dois) or (title and title in seen_titles):
                        continue
                    
                    unique_rows.append(row)
                    if doi: 
                        seen_dois.add(doi)
                    if title: 
                        seen_titles.add(title)

        print(f"Total lines read (excluding header): {total_read}")
    except FileNotFoundError:
        print(f"Input file not found: {input_file}")
        sys.exit(1)

    print(f"Writing to {output_file}...")
    with open(output_file, "w", newline="", encoding="utf-8") as fout:
        writer = csv.writer(fout)
        writer.writerows(unique_rows)
        
    final_count = len(unique_rows) - 1 if unique_rows else 0
    duplicates_removed = total_read - final_count
    
    print("========================================")
    print(f" Deduplication Complete!                ")
    print("========================================")
    print(f"  Rows Evaluated:       {total_read}")
    print(f"  Duplicates Removed:   {duplicates_removed}")
    print(f"  Final Unique Records: {final_count}")
    print("========================================")

if __name__ == "__main__":
    input_csv = "first_search.csv"
    output_csv = "dupe_removal.csv"
    remove_duplicates(input_csv, output_csv)
