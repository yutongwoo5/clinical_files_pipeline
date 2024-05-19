import pandas as pd
from sqlalchemy import create_engine
import os
import csv
import bs4
import requests

_CLINICAL_TRIALS_GOV = "https://clinicaltrials.gov/search"
_EUDRACT = "https://www.clinicaltrialsregister.eu/ctr-search/search?query="

def crawl(url: str) -> None:
    """Crawl the given url."""
    print(url)
    page = requests.get(url)
    soup = bs4.BeautifulSoup(page.content, "html.parser")

    tables = soup.find_all('table', class_='result')
    result = []
    for table in tables:
        paper = {}
        full_title_tag = table.find('span', class_='label', string='Full Title:')
        full_title = full_title_tag.find_next_sibling(text=True).strip()
        paper['Full_Title'] = full_title

        number_tag = table.find('span', class_='label', string='EudraCT Number:')
        number = number_tag.find_next_sibling(text=True).strip()
        paper['EudraCT_Number'] = number

        condition_tag = table.find('span', class_='label', string='Medical condition:')
        condition = condition_tag.find_next_sibling(text=True).strip()
        paper['Medical_condition'] = condition

        sponsor_tag = table.find('span', class_='label', string='Sponsor Name:')
        sponsor = sponsor_tag.find_next_sibling(text=True).strip()
        paper['Sponsor_Name'] = sponsor

        result.append(paper)

    # Get fieldnames (keys) from the first dictionary
    fieldnames = result[0].keys()
    print("scrapper got", result)

    # Write to CSV
    with open("/app/scrapper/data/ctg-studies-eu.csv", "w") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()  # Write the header row with field names
        writer.writerows(result)  # Write the data rows


crawl(_EUDRACT)
def parse_csv(filename):
    df = pd.read_csv(filename)
    print("Columns in CSV:", df.columns)  # For debugging: list all columns in the CSV file

    # Check if the required columns exist in the CSV file
    required_columns = ['EudraCT_Number', 'Full_Title', 'Medical_condition', 'Sponsor_Name']
    for col in required_columns:
        if col not in df.columns:
            print(f"Column not found in CSV: {col}")
            return None

    # Select only the relevant columns
    df = df[required_columns]
    # Rename columns to match database schema
    df.columns = ['EudraCT_number', 'title', 'conditions', 'sponsor']
    return df

def insert_data(df, table_name, db_url):
    engine = create_engine(db_url)
    with engine.connect() as connection:
        df.to_sql(table_name, connection, if_exists='replace', index=False)
    print(f"Inserted data into {table_name} table")


csv_filename = "/app/scrapper/data/ctg-studies-eu.csv"
df = parse_csv(csv_filename)
if df is not None:
    print(df.head())  # For debugging purposes
else:
    print("DataFrame creation failed due to missing columns.")

# Read database URL from environment variable
db_url = os.getenv('DATABASE_URL')

# Insert the parsed data into the 'us' table
insert_data(df, 'eu', db_url)
