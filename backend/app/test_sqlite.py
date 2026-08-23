# test_sqlite.py
import sqlite3

# Connect to the database
conn = sqlite3.connect("ppa_jobs.db")
cursor = conn.cursor()

# Check if the table exists
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='jobs'")
table_exists = cursor.fetchone()
print("Table 'jobs' exists:", bool(table_exists))

# Insert a test record
cursor.execute("""
    INSERT INTO jobs (type, title, posted_date, deadline, description, link, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
""", ("EOI", "Test Job", "20 February, 2025", "28 February, 2025","hello there", "https://example.com/test", "Active"))

# Query the test record
cursor.execute("SELECT * FROM jobs")
print("Test record:", cursor.fetchone())

# Commit and close
conn.commit()
conn.close()