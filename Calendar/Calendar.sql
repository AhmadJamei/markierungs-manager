-- SQLite
SELECT * FROM Calendar_leaverequest;

UPDATE Calendar_leaverequest
SET status = 'approved'
WHERE date = '2026-05-05';

UPDATE Calendar_leaverequest
SET status = 'rejected'
WHERE date = '2026-05-06';

UPDATE Calendar_leaverequest
SET status = 'rejected'
WHERE date = '2026-06-25';

UPDATE Calendar_leaverequest
SET status = 'approved'
WHERE date = '2026-06-09';