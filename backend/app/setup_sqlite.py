# # setup_sqlite.py
# import sqlite3

# # Connect to (or create) the database file
# conn = sqlite3.connect("ppa_jobs.db")
# cursor = conn.cursor()

# # Create the jobs table
# cursor.execute("""
#     CREATE TABLE IF NOT EXISTS jobs (
#         id INTEGER PRIMARY KEY AUTOINCREMENT,
#         type TEXT NOT NULL,
#         title TEXT NOT NULL,
#         posted_date TEXT,
#         deadline TEXT,
#         description TEXT,
#         link TEXT UNIQUE,
#         status TEXT,
#         last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#     )
# """)

# # Commit the changes and close the connection
# conn.commit()
# conn.close()

# print("SQLite database 'ppa_jobs.db' and 'jobs' table created successfully!")








# setup_sqlite.py
import sqlite3

# Connect to (or create) the database file
conn = sqlite3.connect("tender_jobs.db")
cursor = conn.cursor()

# Create the jobs table with source column
cursor.execute("""
    CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        posted_date TEXT,
        deadline TEXT,
        description TEXT,
        link TEXT UNIQUE,
        status TEXT,
        source TEXT NOT NULL,  -- New column
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
""")

# Commit the changes and close the connection
conn.commit()
conn.close()

print("SQLite database 'tender_jobs.db' and 'jobs' table created successfully!")






# # db_handler.py
# import sqlite3

# def init_db():
#     """Initialize database tables"""
#     conn = sqlite3.connect('tender_jobs.db')
#     cursor = conn.cursor()
#     cursor.execute('''
#         CREATE TABLE IF NOT EXISTS jobs (
#             id INTEGER PRIMARY KEY AUTOINCREMENT,
#             type TEXT,
#             title TEXT,
#             posted_date TEXT,
#             deadline TEXT,
#             description TEXT,
#             link TEXT UNIQUE,
#             status TEXT,
#             source TEXT,
#             last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#         )
#     ''')
#     conn.commit()
#     conn.close()

# def save_jobs(jobs):
#     """Save scraped jobs to database"""
#     conn = sqlite3.connect('tender_jobs.db')
#     cursor = conn.cursor()
#     cursor.executemany('''
#         INSERT OR REPLACE INTO jobs 
#         (type, title, posted_date, deadline, description, link, status, source)
#         VALUES (:type, :title, :posted_date, :deadline, :description, :link, :status, :source)
#     ''', jobs)
#     conn.commit()
#     conn.close()