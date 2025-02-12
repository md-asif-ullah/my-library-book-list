CREATE TABLE "Books" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Books_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"category" varchar NOT NULL,
	"price" numeric NOT NULL,
	"writer" varchar NOT NULL,
	"image" varchar NOT NULL,
	"rating" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
