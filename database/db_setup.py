import os
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Text

# Read the database URL from environment variable
DATABASE_URL = os.getenv('DATABASE_URL')

# Create a database engine
engine = create_engine(DATABASE_URL)
metadata = MetaData()

# Define the 'us' table
us_table = Table(
    'us', metadata,
    Column('id', Integer, primary_key=True),
    Column('nct_number', String(255), unique=True, nullable=False),
    Column('title', Text),
    Column('conditions', Text),
    Column('sponsor', Text)
)

# Define the 'eu' table
eu_table = Table(
    'eu', metadata,
    Column('id', Integer, primary_key=True),
    Column('eudract_number', String(255), unique=True, nullable=False),
    Column('title', Text),
    Column('conditions', Text),
    Column('sponsor', Text)
)

# Define the 'combined' table
combined_table = Table(
    'combined', metadata,
    Column('id', Integer, primary_key=True),
    Column('identifier', String(255), unique=True, nullable=False),
    Column('title', Text),
    Column('conditions', Text),
    Column('sponsor', Text),
    Column('source', String(10))
)

# Create all tables
metadata.create_all(engine)
