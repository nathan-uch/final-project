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
    select "sets"."workoutId",
           "sets"."exerciseId",
           "sets"."setOrder",
           "sets"."reps",
           "sets"."weight",
           "exercises"."name",
           "exercises"."equipment"
    from "sets"
    join "exercises" using ("exerciseId")
    where "sets"."workoutId" = $1;
  `;
  db.query(sql, params)
    .then(result => {
      const splitExercises = result.rows.map(exercise => {
        const exerObj = {
          exerciseId: exercise.exerciseId,
          name: exercise.name,
          equipment: exercise.equipment,
          sets: [{
            setOrder: 1,
            reps: null,
            weight: null
          }]
        };
        return exerObj;
      });
      const workout = {
        workoutId: result.rows[0].workoutId,
        exercises: splitExercises
      };
      res.status(200).json(workout);
    })
    .catch(err => next(err));
});

// creates new workout
app.post('/api/new-workout', (req, res, next) => {
  const userId = 1;
  if (!userId) throw new ClientError(400, 'ERROR: Invalid user.');
  const params = [userId];
  const sql = `
    insert into "workout" ("userId")
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

// saves multiple NEW exercises (as sets) in workout
app.post('/api/workout/new-exercises', (req, res, next) => {
  const { workoutId, exerciseIds } = req.body;
  if (!workoutId || exerciseIds.length < 1) throw new ClientError(400, 'ERROR: Existing workoutId and exerciseId are required');
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
    values             ${ids}
    returning *;
  `;
  db.query(sql, params)
    .then(result => {
      const addedSets = result.rows;
      res.status(201).json(addedSets);
    })
    .catch(err => next(err));
});

// edits 1st set and adds other sets to workout
app.patch('/api/workout/:workoutId', (req, res, next) => {
  const workoutId = Number(req.body.workoutId);
  const { exercises } = req.body;
  if (!exercises) throw new ClientError(400, 'ERROR: Missing exercises.');
  const exercisePromises = exercises.flatMap(exercise => {
    const { exerciseId, sets } = exercise;
    const setPromises = sets.map(set => {
      const { reps, weight, setOrder } = set;
      const params = [reps, weight, setOrder, workoutId, exerciseId];
      if (setOrder === 1) {
        const updateSql = `
        update "sets"
        set    "reps" = $1,
               "weight" = $2
        where  "setOrder" = $3
        and     "workoutId" = $4
        and    "exerciseId" = $5
        returning *
        `;
        return db.query(updateSql, params);
      } else {
        const addSql = `
        insert into "sets" ("reps", "weight", "setOrder", "workoutId", "exerciseId")
        values             ($1, $2, $3, $4, $5)
        returning *;
        `;
        return db.query(addSql, params);
      }
    });
    return setPromises;
  });
  Promise.all(exercisePromises)
    .then(result => {
      const resultSets = result.rows;
      res.status(204).json(resultSets);
    })
    .catch(err => next(err));
});

// deletes an exercise from workout
app.delete('/api/workout/:workoutId/exercise/:exerciseId', (req, res, next) => {
  const workoutId = Number(req.params.workoutId);
  const exerciseId = Number(req.params.exerciseId);
  if (!workoutId || !exerciseId) throw new ClientError(400, 'ERROR: Missing valid workoutId or exerciseId');
  const params = [workoutId, exerciseId];
  const sql = `
  delete from "sets"
  where "workoutId" = $1
  and "exerciseId" = $2
  returning *;
  `;
  db.query(sql, params)
    .then(result => {
      const deletedSets = result.rows;
      res.status(204).json(deletedSets);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
