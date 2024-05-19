# Use an appropriate base image, e.g., Python for a Python scraper
FROM python:3.9-slim

# Set environment variables
ENV DATABASE_URL="postgresql://username:password@localhost:5432/mydatabase"

# Set the working directory
WORKDIR /app

# Copy the requirements.txt file
COPY requirements.txt /app/

# Install dependencies
RUN pip install -r requirements.txt

# Copy the scraper code to the container
COPY . /app/scrapper

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Command to run the scraper
CMD ["python", "/app/scrapper/clinical_trials_us.py"]
CMD ["python", "/app/scrapper/clinical_trials_eu.py"]
# CMD python /app/database/db_setup.py && python /app/scrapers/clinical_trials_us.py