-- News or column. Every article stays at /blog/posts/<slug>/; this only decides the list it appears in.
ALTER TABLE posts ADD COLUMN kind TEXT NOT NULL DEFAULT 'news';
