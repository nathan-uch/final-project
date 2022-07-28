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

app.post('/api/workout', (req, res, next) => {
  const { userId } = req.body;
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
      res.status(200).json(newWorkout);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
