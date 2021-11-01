-- index for products.title
CREATE INDEX CONCURRENTLY products_title_trigram_idx
ON products
USING gin
(title gin_trgm_ops);

-- index for products.description
CREATE INDEX CONCURRENTLY products_description_trigram_idx
ON products
USING gin
(description gin_trgm_ops);