function getEvents(){
  const { Client } = require('pg');
  const db = new Client({
    database: 'analytics'
  });
  return db.connect()
  .then(() => {
    return db.query(`
    SELECT MAX(timestamp) from cache
  `)
  })
  .then(maxTime => {
    return db.query(`
      SELECT browser, os, path, date_trunc('minute', timestamp) as bucket, COUNT(*) as sum_all, COUNT(DISTINCT(uuid)) as uniquevisit
      FROM events
      WHERE date_trunc('minute', timestamp) >= $1
      GROUP BY browser, os, path, bucket
      ORDER BY bucket
      LIMIT 1000
      `, [maxTime.rows[0].max < new Date('2018-01-01T08:00:00.000Z') ? '2018-01-01T08:00:00.000Z' : maxTime.rows[0].max]);
  })
  .then(filters => {
    return Promise.all(filters.rows.map((row)=>{
      return db.query(`
        INSERT INTO cache
        (timestamp, path, browser, os, visits, uniquevisit)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (timestamp, path, browser, os)
        DO UPDATE SET visits = $5, uniquevisit = $6
      `, [row.bucket,row.path, row.browser, row.os, row.sum_all, row.uniquevisit])
    }))
  })
  .then(() => db.end())
}

async function iterate(){
  for (var i = 0; i < 10; i++) {
    console.log(i);
    await getEvents();
  }
}

iterate();
