require('dotenv/config');
const path = require('path');
const express = require('express');
const errorMiddleware = require('./error-middleware');

const app = express();
const publicPath = path.join(__dirname, 'public');

if (process.env.NODE_ENV === 'development') {
  app.use(require('./dev-middleware')(publicPath));
} else {
  app.use(express.static(publicPath));
}

app.post('/api/workout', (req, res, next) => {
  // get current user id
  // get exercise name

});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
