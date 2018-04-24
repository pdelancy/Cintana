"use strict";

const moment = require('moment');

const express = require('express');
const app = express();
const useragent = require('useragent');

const { Pool } = require('pg');
const db = new Pool({database: 'analytics'});

app.get("/api", (req, res) => {
  console.log("HELLO!");
  res.send("hello world");
})

app.get('/api/log/visit/:uuid', async (req, res) => {
  try {
    var agent = useragent.parse(req.headers['user-agent']);
    agent = agent.toString().split('/');

    let browser = agent[0].split(' ').slice(0, -2).join(' ');
    let os = agent[1].split(' ').slice(1, -1).join(' ');
    console.log(req.query.timestamp || moment().toISOString());
    await db.query(`
      INSERT INTO events
        (uuid, timestamp, path, browser, os)
        VALUES ($1, $2, $3, $4, $5)
    `, [
      req.params.uuid,
      req.query.timestamp || moment().toISOString(),
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

app.get('/api/events', async (req, res) => {
  try{
    let times = await db.query(`
      SELECT * FROM events
      WHERE timestamp > $1 AND timestamp < $2
    `, [req.query.start, req.query.end]);
    console.log("FOUND TIMES:", times.rows);
    res.send(times.rows)
  } catch (e) {
    res.status(400).send(e.message)
  }
})

app.listen(process.env.PORT || 3001, () => {
  console.log("Listening on port " + 3001);
})
