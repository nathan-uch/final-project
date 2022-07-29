set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."users" (
	"userId" serial NOT NULL UNIQUE,
	"username" TEXT NOT NULL UNIQUE,
	"hashedPassword" TEXT NOT NULL,
	"createdAt" TIMESTAMP NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."workout templates" (
	"workoutId" serial NOT NULL UNIQUE,
	"userId" serial NOT NULL UNIQUE,
	CONSTRAINT "workout templates_pk" PRIMARY KEY ("workoutId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."exercise" (
	"exerciseId" serial NOT NULL UNIQUE,
	"name" TEXT NOT NULL UNIQUE,
	"muscleGroup" TEXT NOT NULL,
	"equipment" TEXT NOT NULL,
	"notes" TEXT,
	CONSTRAINT "exercise_pk" PRIMARY KEY ("exerciseId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."sets" (
	"workoutId" serial NOT NULL,
	"exerciseId" int NOT NULL,
	"reps" int NOT NULL,
	"weight" int NOT NULL
) WITH (
  OIDS=FALSE
);




ALTER TABLE "workout templates" ADD CONSTRAINT "workout templates_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");


ALTER TABLE "sets" ADD CONSTRAINT "sets_fk0" FOREIGN KEY ("workoutId") REFERENCES "workout templates"("workoutId");
ALTER TABLE "sets" ADD CONSTRAINT "sets_fk1" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("exerciseId");
