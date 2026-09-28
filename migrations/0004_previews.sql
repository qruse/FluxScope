CREATE TABLE IF NOT EXISTS previews (
  token TEXT NOT NULL,
  lang TEXT NOT NULL,
  slug TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  body TEXT NOT NULL,
  image_url TEXT,
  image_alt TEXT,
  tags TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  PRIMARY KEY (token, lang)
);
CREATE INDEX IF NOT EXISTS previews_slug ON previews(slug);
