const { Pool } = require('pg');
const db = new Pool();

db.query(`
  DROP TABLE IF EXISTS events;

  CREATE TABLE events (
    uuid UUID NOT NULL,
    timestamp TIMESTAMPTz NOT NULL,
    path VARCHAR(256) NOT NULL,
    browser VARCHAR(64),
    os VARCHAR(64)
  );
`)
