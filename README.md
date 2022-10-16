# STRIVE - Workout Tracker

A solo full-stack React project.

### What is STRIVE?
Strive is a full stack web-application for workout enthusiasts who want to track workouts and progress in the gym.

As a regular gym goer, I found myself regularly forgetting previous workout volumes and reach the inevitable plateau making improvement altogether more difficult. The idea of creating a workout tracker was actually in my mind as soon as I started learning the basics of HTML, CSS and JavaScript but after learning back-end technologies, the project came closer to fruition.

### Live Demo:
Try the live app at [https://striveworkout.app/](https://striveworkout.app/)

## Technologies Used:
* React.js
* Webpack
* Node.js
* Express.js
* PostgreSQL
* JavaScript
* HTML5
* CSS3
* Bulma.io
* Heroku

## Features:
* User can create workout
* User can view exercise list
* User can add exercises to workout
* User can view a workout's exercises and sets
* User can edit and add sets
* User can delete exercise from workout
* User can save workouts
* User can view workout history

## Preview:
![STRIVE Preview](/server/public/assets/preview.gif)

## Future Features:
* User can create workout templates (presaved exercises)
* User can replace exercises in workout
* User can add notes to exercises

# Development

## System Requirements:
* Node v18
* NPM v8
* PostgreSQL v14

## Getting Started:
1. Clone repository

```shell
git clone git@github.com:nathan-uch/final-project.git
cd final-project
```

2. Install [PostgreSQL](https://www.postgresql.org/download/)

3. Install dependencies with npm
```shell
npm install
```

4. Start and import example database to PostgreSQL
```shell
sudo service postgresql start
npm run db:import
```
Optional: Use [pgweb](https://github.com/sosedoff/pgweb) to view your database

5. Start the server. Once the server is online, view the application on http://localhost:3000 in your browser.
```shell
npm run dev
```

6. Enjoy coding!
