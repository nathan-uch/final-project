require('dotenv/config');
const path = require('path');
const express = require('express');
const pg = require('pg');
const errorMiddleware = require('./error-middleware');
const ClientError = require('./client-error');

const app = express();
const jsonMiddleware = express.json();
app.use(jsonMiddleware);
const publicPath = path.join(__dirname, 'public');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

if (process.env.NODE_ENV === 'development') {
  app.use(require('./dev-middleware')(publicPath));
} else {
  app.use(express.static(publicPath));
}

app.get('/api/all-exercises', (req, res, next) => {
  const sql = `
    select *
    from "exercises"
    order by "name" desc;
  `;
  db.query(sql)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => next(err));
});

app.get('/api/workout/sets', (req, res, next) => {
  const { workoutId } = req.body;
  if (!workoutId) throw new ClientError(400, 'ERROR: Invalid workoutId.');
  const params = [workoutId];
  const sql = `
    select *
    from "sets"
    where "workoutId" = $1
    order by "exerciseId" desc;
  `;
  db.query(sql, params)
    .then(result => {
      const sets = res.rows;
      res.status(201).json(sets);
    })
    .catch(err => next(err));
});

app.post('/api/workout', (req, res, next) => {
  const userId = 1;
  if (!userId) throw new ClientError(400, 'ERROR: Invalid user.');
  const params = [userId];
  const sql = `
    insert into "workout templates" ("userId")
    values ($1)
    returning *;
  `;
  db.query(sql, params)
    .then(result => {
      const newWorkout = res.rows;
      res.status(201).json(newWorkout);
    })
    .catch(err => next(err));
});

app.post('/api/workout/add-set', (req, res, next) => {
  const { workoutId, exerciseId } = req.body;
  if (!workoutId || !exerciseId) throw new ClientError(400, 'Existing workoutId and exerciseId are required');
  const params = [workoutId, exerciseId];
  const sql = `
    insert into "sets" ("workoutId", "exerciseId")
    values ($1, $2)
    returning *;
  `;
  db.query(sql, params)
    .then(result => {
      const addedSets = res.rows;
      res.status(201).json(addedSets);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
