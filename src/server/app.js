"use strict";

const express = require('express');
const app = express();

const { Pool } = require('pg');
const db = new Pool({database: 'analytics'});

app.get("/api", (req, res) => {
  console.log("HELLO!");
  res.send("hello world");
})

app.get('/api/log/visit/:uuid', async (req, res) => {
  try {
    await db.query(`
      INSERT INTO events
        (userId, timestamp, path, browser, os)
        VALUES ($1, $2, $3, $4, $5)
    `, [
      req.params.uuid,
      req.query.timestamp || new Date(),
      req.query.path,
      req.query.browser,
      req.query.os,
    ]);
    console.log("received");
    res.send('received');
  } catch(e) {
    console.log('Error receiving event:', e);
    res.status(400).send(e.message);
  }
})

app.listen(process.env.PORT || 3001, () => {
  console.log("Listening on port " + 3001);
})
