insert into "users" ("username", "hashedPassword", "createdAt")
values ('admin', 'a', '2022-07-27T16:01:32.134Z');

insert into "exercise" ("exerciseId", "name", "muscleGroup", "equipment")
values (1, 'bench press', 'chest', 'barbell'),
       (2, 'pull ups', 'back', 'null'),
       (3, 'deadlift', 'hamstrings', 'barbell'),
       (4, 'squats', 'quads', 'barbell'),
       (5, 'incline press', 'chest', 'barbell'),
       (6, 'lat pulldown', 'back', 'cable bar'),
       (7, 'overhead press', 'deltoids', 'dumbbell'),
       (8, 'leg press', 'quads', 'machine');
