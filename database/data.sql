insert into "users" ("username", "hashedPassword")
values              ('admin', 'a'),
                    ('user', 'abc');


insert into "workouts" ("workoutId", "userId")
values                          (1, 1),
                                (2, 1),
                                (3, 2);


insert into "exercises" ("exerciseId", "name", "muscleGroup", "equipment")
values                  (1, 'Bench Press', 'Chest', 'barbell'),
                        (2, 'Pull ups', 'Back', null),
                        (3, 'Deadlift', 'Hamstrings', 'barbell'),
                        (4, 'Squats', 'Quads', 'barbell'),
                        (5, 'Incline Press', 'Chest', 'barbell'),
                        (6, 'Lat Pulldown', 'Back', 'cable bar'),
                        (7, 'Overhead Press', 'Deltoids', 'dumbbell'),
                        (8, 'Leg Press', 'Quads', 'machine');

insert into "sets" ("workoutId", "exerciseId", "setOrder")
values             (1, 1, 1),
                   (1, 4, 1),
                   (2, 5, 1),
                   (2, 7, 1),
                   (3, 2, 1);

insert into "sets" ("workoutId", "exerciseId", "setOrder", "reps", "weight")
values             (2, 1, 1, 10, 100),
                   (2, 3, 1, 8, 90),
                   (2, 3, 2, 8, 90),
                   (2, 3, 3, 8, 90),
                   (2, 4, 1, 12, 60),
                   (2, 4, 2, 12, 60),
                   (2, 4, 3, 12, 60);

insert into "sets" ("workoutId", "exerciseId", "setOrder", "reps", "weight")
values             (3, 1, 1, 10, 100),
                   (3, 1, 1, 8, 90),
                   (3, 1, 2, 8, 90),
                   (3, 2, 2, 12, 50);
