//statements.sql
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);


INSERT INTO users (username, password)
VALUES ("admin","123")
INSERT INTO users (username, password)
VALUES ("aleon","aleon3")