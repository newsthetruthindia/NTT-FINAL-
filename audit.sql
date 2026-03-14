SELECT 'EMPTY_DESCRIPTION' as audit_type, COUNT(*) FROM posts WHERE description IS NULL OR description = '';
SELECT 'EMPTY_EXCERPT' as audit_type, COUNT(*) FROM posts WHERE excerpt IS NULL OR excerpt = '';
SELECT 'BROKEN_THUMBNAILS' as audit_type, p.id, p.title FROM posts p LEFT JOIN medias m ON p.thumbnail = m.id WHERE p.thumbnail IS NOT NULL AND m.id IS NULL LIMIT 20;
SELECT 'MEDIA_FILE_CHECK' as audit_type, id, filename, disk FROM medias LIMIT 10;
