CREATE TABLE IF NOT EXISTS posts (
  lang TEXT NOT NULL CHECK (lang IN ('ko', 'en')),
  slug TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  body TEXT NOT NULL,
  image_url TEXT,
  image_alt TEXT,
  tags TEXT NOT NULL DEFAULT '[]',
  published_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (lang, slug)
);
CREATE INDEX IF NOT EXISTS posts_published ON posts(lang, published_at DESC);
