const { Pool } = require('pg');
const db = new Pool();

exports.handler = (event, context, callback) => {
  getEvents
  .then(result => callback(null, result))
  .catch(err => {
    console.error(err, err.stack)
    callback(err)
  })
}

function getEvents(){
  let maxTime;
  let filters;
  db.query(`SELECT MAX(timestamp) from cache`)
  .then(result=>{
    console.log("result");
    maxTime = result.rows[0]
  })
  .then(()=>{
    db.query(`
      SELECT browser, os, path, date_trunc('minute', timestamp), COUNT(*) as sum_all, COUNT(DISTINCT(uuid)) as uniquevisit
      FROM events
      WHERE date_trunc('minute', timestamp) >= $1
      GROUP BY browser, os, path, date_trunc('minute', timestamp)
      `, [maxTime ? maxTime : new Date(0).toISOString()])
  })
  .then(results=>{
    filters = results;
  })
  .then(()=>{
    Promise.all(filters.rows.map((row)=>{
      return db.query(`
        INSERT INTO cache
        (timestamp, path, browser, os, visits, uniquevisit)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (timestamp, path, browser, os)
        DO UPDATE SET visits = $5, uniquevisit = $6
      `, [row.date_trunc,row.path, row.browser, row.os, row.sum_all, row.uniquevisit])
    }))
  })
  .catch(e=>console.log(e););
}

getEvents();
