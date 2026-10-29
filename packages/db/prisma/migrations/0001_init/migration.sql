CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Prisma will own table DDL after `prisma migrate`. This file is the checked-in baseline.
-- Enable RLS on tenant tables (policies assume SET LOCAL app.user_id = '<clerk id>').

DO $$ BEGIN
  PERFORM 1;
END $$;
