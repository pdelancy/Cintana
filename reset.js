const { Pool } = require('pg');
const db = new Pool();

db.query(`
  DROP TABLE IF EXISTS events;
  DROP TABLE IF EXISTS cache;

  CREATE TABLE events (
    uuid UUID NOT NULL,
    timestamp TIMESTAMPTz NOT NULL,
    path VARCHAR(256) NOT NULL,
    browser VARCHAR(64),
    os VARCHAR(64)
  );

  CREATE INDEX timestamp_idx ON events (timestamp);

  CREATE TABLE cache (
    timestamp TIMESTAMPTZ NOT NULL,
    path VARCHAR(256) NOT NULL,
    browser VARCHAR(64),
    os VARCHAR(64),
    visits INTEGER NOT NULL,
    uniquevisit INTEGER NOT NULL
  );

  CREATE INDEX timestamp_idx2 ON cache (timestamp);
  ALTER TABLE cache ADD CONSTRAINT cache_uq UNIQUE (timestamp, path, browser, os);
`)
