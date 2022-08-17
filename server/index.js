require('dotenv/config');
const path = require('path');
const express = require('express');
const pg = require('pg');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const errorMiddleware = require('./error-middleware');
const authorizationMiddleware = require('./authorization-middleware');
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

app.post('/api/auth/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) throw new ClientError(400, 'ERROR: Username and password are required fields.');
  argon2
    .hash(password)
    .then(hashedPassword => {
      const params = [username, hashedPassword];
      const sql = `
      insert into "users" ("username", "hashedPassword")
      values              ($1, $2)
      returning "userId", "username", "createdAt";
      `;
      return db.query(sql, params);
    })
    .then(result => {
      const [user] = result.rows;
      res.status(201).json(user);
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) throw new ClientError(401, 'Invalid login.');
  const params = [username];
  const sql = `
  select "userId", "hashedPassword", "username"
  from "users"
  where "username" = $1
  `;
  db.query(sql, params)
    .then(result => {
      const username = result.rows[0].username;
      const hashedPassword = result.rows[0].hashedPassword;
      if (!username) throw new ClientError(401, 'Username does not exist.');
      argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) throw new ClientError(401, 'Invalid login.');
          const payload = {
            userId: result.rows[0].userId,
            username
          };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          const responseObj = { token, user: payload };
          res.status(200).json(responseObj);
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.get('/api/all-usernames', (req, res, next) => {
  const sql = `
  select "username"
  from "users";
  `;
  db.query(sql)
    .then(result => {
      const users = [];
      result.rows.forEach(user =>
        users.push(user.username)
      );
      res.status(200).json(users);
    })
    .catch(err => next(err));
});

app.use(authorizationMiddleware);

app.get('/api/all-exercises', (req, res, next) => {
  const sql = `
    select *
    from "exercises"
    order by "name" asc;
  `;
  db.query(sql)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => next(err));
});

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
        workoutId,
        exercises: splitExercises
      };
      res.status(200).json(workout);
    })
    .catch(err => next(err));
});

app.get('/api/user/:userId/workouts', (req, res, next) => {
  const userId = 1;
  if (!userId) throw new ClientError(400, 'ERROR: Invalid user.');
  const params = [userId];
  const sql = `
    with "bestSetCTE" as (
      select    *,
                "reps" * "weight" as "volume",
                row_number() over (partition by "workoutId", "exerciseId" order by "reps" * "weight" desc)
      from      "sets"
      join      "workouts" using ("workoutId")
      join      "exercises" using ("exerciseId")
      where     "reps" IS NOT NULL
      and       "weight" IS NOT NULL
      and       "userId" = $1
      group by  "sets"."exerciseId",
                "sets"."workoutId",
                "sets"."setOrder",
                "sets"."reps",
                "sets"."weight",
                "workouts"."userId",
                "exercises"."name",
                "exercises"."muscleGroup",
                "exercises"."equipment",
                "exercises"."notes"
    ),
    "totalSetsCTE" as (
      select      count("sets".*) as "totalSets",
                  "exerciseId",
                  "workouts"."workoutId"
      from        "sets"
      join        "workouts" using ("workoutId")
      join        "exercises" using ("exerciseId")
      where       "workouts"."userId" = $1
      and         "sets"."reps" IS NOT NULL
      and         "sets"."weight" IS NOT NULL
      group by    "exercises"."exerciseId",
                  "workouts"."workoutId",
                  "sets"."exerciseId"
      order by    "exerciseId" desc
    )
    select    "equipment",
              "exerciseId",
              "name",
              "reps",
              "totalSets",
              "weight",
              "workoutId"
    from      "bestSetCTE"
    join      "totalSetsCTE" using ("workoutId", "exerciseId")
    where     "row_number" = 1
    order by "name" asc;
  `;
  db.query(sql, params)
    .then(result => {
      const userWorkouts = result.rows;
      res.status(200).json(userWorkouts);
    })
    .catch(err => next(err));
});

app.post('/api/new-workout', (req, res, next) => {
  const userId = 1;
  if (!userId) throw new ClientError(400, 'ERROR: Invalid user.');
  const params = [userId];
  const sql = `
    insert into "workouts" ("userId")
    values      ($1)
    returning *;
  `;
  db.query(sql, params)
    .then(result => {
      const newWorkout = res.rows;
      res.status(201).json(newWorkout);
    })
    .catch(err => next(err));
});

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
    return `($1, $${paramIndex}, 1)`;
  });
  const sql = `
    insert into "sets" ("workoutId", "exerciseId", "setOrder")
    values      ${ids}
    returning *;
  `;
  db.query(sql, params)
    .then(result => {
      const addedSets = result.rows;
      res.status(201).json(addedSets);
    })
    .catch(err => next(err));
});

app.patch('/api/workout/:workoutId', (req, res, next) => {
  const workoutId = Number(req.params.workoutId);
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

app.delete('/api/workout/:workoutId/exercise/:exerciseId', (req, res, next) => {
  const workoutId = Number(req.params.workoutId);
  const exerciseId = Number(req.params.exerciseId);
  if (!workoutId || !exerciseId) throw new ClientError(400, 'ERROR: Missing valid workoutId or exerciseId');
  const params = [workoutId, exerciseId];
  const sql = `
  delete from   "sets"
  where         "workoutId" = $1
  and           "exerciseId" = $2
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
