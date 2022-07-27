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
	"exercises" serial UNIQUE,
	"templateName",
	CONSTRAINT "workout templates_pk" PRIMARY KEY ("workoutId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."exercise" (
	"exerciseId" serial NOT NULL UNIQUE,
	"exerciseName" TEXT NOT NULL UNIQUE,
	"bodyPart" serial NOT NULL,
	"equipment" TEXT NOT NULL,
	"setId" integer,
	"notes" TEXT,
	CONSTRAINT "exercise_pk" PRIMARY KEY ("exerciseId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."sets" (
	"setId" serial NOT NULL,
	"reps" integer NOT NULL,
	"weight" integer NOT NULL,
	CONSTRAINT "sets_pk" PRIMARY KEY ("setId")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "workout templates" ADD CONSTRAINT "workout templates_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "workout templates" ADD CONSTRAINT "workout templates_fk1" FOREIGN KEY ("exercises") REFERENCES "exercise"("exerciseId");

ALTER TABLE "exercise" ADD CONSTRAINT "exercise_fk0" FOREIGN KEY ("setId") REFERENCES "sets"("setId");
