CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page TEXT NOT NULL,
  parent_id INTEGER REFERENCES comments(id),
  nickname TEXT NOT NULL,
  mention TEXT,
  body TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  deleted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS comments_page ON comments(page, id);
CREATE INDEX IF NOT EXISTS comments_ip ON comments(ip_hash, created_at);
