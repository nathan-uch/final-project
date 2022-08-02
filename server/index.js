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

// gets all exercises
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

// gets all exercises in a workout
app.get('/api/workout/:workoutId', (req, res, next) => {
  const workoutId = Number(req.params.workoutId);
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
      const sets = result.rows;
      res.status(200).json(sets);
    })
    .catch(err => next(err));
});

// creates new workout
app.post('/api/new-workout', (req, res, next) => {
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

// saves multiple new exercises (as sets) in workout
app.post('/api/workout/new-exercises', (req, res, next) => {
  const { workoutId, exerciseIds } = req.body;
  if (!workoutId || exerciseIds.length < 1) throw new ClientError(400, 'Existing workoutId and exerciseId are required');
  const params = [Number(workoutId)];
  exerciseIds.forEach(id => {
    params.push(Number(id));
  });
  let paramIndex = 1;
  const ids = exerciseIds.map((id, index) => {
    paramIndex++;
    if (index !== exerciseIds.length - 1) {
      return `($1, $${paramIndex})`;
    } else {
      return `($1, $${paramIndex})`;
    }
  });
  const sql = `
    insert into "sets" ("workoutId", "exerciseId")
    values ${ids}
    returning *;
  `;
  db.query(sql, params)
    .then(result => {
      const addedSets = result.rows;
      res.status(201).json(addedSets);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
