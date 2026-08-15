CREATE TABLE "rate_limits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"last_request" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "rate_limits_key_uidx" ON "rate_limits" USING btree ("key");--> statement-breakpoint
CREATE INDEX "rate_limits_last_request_idx" ON "rate_limits" USING btree ("last_request");