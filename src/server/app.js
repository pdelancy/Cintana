"use strict";

const moment = require('moment');
const express = require('express');
const app = express();
const useragent = require('useragent');


const { Pool } = require('pg');

const db = new Pool(
  {database: "cintana"}
);

const segmentations = {
  path: true,
  os: true,
  browser: true
}

app.get("/api", (req, res) => {
  console.log("HELLO!");
  res.send(process.env.PGDATABASE);
})

app.get('/api/log/visit/:uuid', async (req, res) => {
  try {
    var agent = useragent.parse(req.headers['user-agent']);
    agent = agent.toString().split('/');

    let browser = agent[0].split(' ').slice(0, -2).join(' ');
    let os = agent[1].split(' ').slice(1, -1).join(' ');

    await db.query(`
      INSERT INTO events
        (uuid, timestamp, path, browser, os)
        VALUES ($1, $2, $3, $4, $5)
    `, [
      req.params.uuid,
      req.query.timestamp || new Date().toISOString(),
      req.query.path,
      browser,
      os,
    ]);
    res.status(200).json({success: true})
  } catch(e) {
    console.log('Error receiving event:', e);
    res.status(400).send(e.message);
  }
})

app.get('/api/events', async (req, res)=>{
  try{
    let times = await db.query(`
      SELECT * FROM events
      WHERE timestamp > $1 AND timestamp < $2
    `, [req.query.start, req.query.end]);
    // console.log("FOUND TIMES:", times.rows);
    res.send(times.rows)
  } catch (e) {
    res.status(400).send(e.message)
  }
})

app.get('/api/statistics/:timeunit', async (req, res) => {

  //start, end, browser, os, path
  try{
  let start = (new Date(req.query.start)).toISOString(), end = (new Date(req.query.end)).toISOString()
  let count = 2;
  let result = await db.query(
    `SELECT ${segmentations[req.query.segmentation] ? req.query.segmentation + ", " : ""} date_trunc($1, timestamp) AS timebucket, SUM(visits) as count, SUM(uniquevisit) as uniquecount FROM cache
      WHERE ${start ? 'timestamp >= $' + count++ : ""}
      ${end ? ' AND timestamp <= $' + count++ : ""}
      ${req.query.browser ? ' AND browser = $' + count++ : ""}
      ${req.query.os ? ' AND os = $' + count++ : ""}
      ${req.query.path ? ' AND path LIKE $' + count++ : ""}
      GROUP BY ${segmentations[req.query.segmentation] ? req.query.segmentation + ", " : ""} timebucket`
      ,
    [
      req.params.timeunit === 'hour' ? 'hour' : 'minute',
      start, end,
      req.query.browser, req.query.os,
      req.query.path ? req.query.path + '%' : null
    ].filter(a => a));
    console.log(result.rows[0]);
  res.send(result.rows)
} catch(e){
  console.log("error fetching stats", e);
  res.status(400).send(e.message)
}
});

app.get('/api/values', async (req, res)=>{
  try{
    let returnResult = {
      browser: [],
      os: []
    };
    let browsers = await db.query(`SELECT DISTINCT browser FROM cache`);
    let oss = await db.query(`SELECT DISTINCT os FROM cache`);
    browsers.rows.map((item)=>{
      returnResult.browser.push(item.browser)
    });
    oss.rows.map((item)=>{
      returnResult.os.push(item.os)
    });
    res.send(returnResult);
  } catch(e) {
    console.log('Error getting values:', e);
    res.status(400).send(e.message);
  }
})

app.listen(process.env.PORT || 3001, () => {
  console.log("Listening on port " + 3001);
})
