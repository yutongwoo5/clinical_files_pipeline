import pandas as pd
from sqlalchemy import create_engine
import os


def parse_csv(filename):
    df = pd.read_csv(filename)
    print("Columns in CSV:", df.columns)  # For debugging: list all columns in the CSV file

    # Check if the required columns exist in the CSV file
    required_columns = ['NCT Number', 'Study Title', 'Conditions', 'Sponsor']
    for col in required_columns:
        if col not in df.columns:
            print(f"Column not found in CSV: {col}")
            return None

    # Select only the relevant columns
    df = df[required_columns]
    # Rename columns to match database schema
    df.columns = ['nct_number', 'title', 'conditions', 'sponsor']
    return df

def insert_data(df, table_name, db_url):
    engine = create_engine(db_url)
    with engine.connect() as connection:
        df.to_sql(table_name, connection, if_exists='replace', index=False)
    print(f"Inserted data into {table_name} table")


csv_filename = "/app/scrapper/data/ctg-studies-us.csv"
df = parse_csv(csv_filename)
if df is not None:
    print(df.head())  # For debugging purposes
else:
    print("DataFrame creation failed due to missing columns.")

# Read database URL from environment variable
db_url = os.getenv('DATABASE_URL')

# Insert the parsed data into the 'us' table
insert_data(df, 'us', db_url)
