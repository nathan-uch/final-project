insert into "users" ("username", "hashedPassword", "createdAt")
values              ('admin', 'a', '2022-07-27T16:01:32.134Z');

insert into "workout templates" ("userId")
values                          (1);

insert into "exercises" ("exerciseId", "name", "muscleGroup", "equipment")
values                  (1, 'Bench Press', 'Chest', 'barbell'),
                        (2, 'Pull ups', 'Back', null),
                        (3, 'Deadlift', 'Hamstrings', 'barbell'),
                        (4, 'Squats', 'Quads', 'barbell'),
                        (5, 'Incline Press', 'Chest', 'barbell'),
                        (6, 'Lat Pulldown', 'Back', 'cable bar'),
                        (7, 'Overhead Press', 'Deltoids', 'dumbbell'),
                        (8, 'Leg Press', 'Quads', 'machine');

insert into "sets" ("workoutId", "exerciseId")
values             (1, 2);
