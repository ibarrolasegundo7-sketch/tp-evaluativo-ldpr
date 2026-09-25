import sqlite3

def get_connection():
    conn = sqlite3.connect("tienda.db")
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.commit()
        conn.close()

def initDb():
    conn = sqlite3.connect("tienda.db")
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY,
            nombre TEXT,
            precio INT,
            stock INT
        )
    """)

    conn.commit()
    conn.close()