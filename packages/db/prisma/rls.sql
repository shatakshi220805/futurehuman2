-- Applied after prisma migrate. Every policy requires the session user id.
-- The API sets: SELECT set_config('app.user_id', $1, true);

ALTER TABLE "MemoryItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MemoryItem" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS memory_item_isolation ON "MemoryItem";
CREATE POLICY memory_item_isolation ON "MemoryItem"
  USING ("userId" = current_setting('app.user_id', true))
  WITH CHECK ("userId" = current_setting('app.user_id', true));

ALTER TABLE "Meeting" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Meeting" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS meeting_isolation ON "Meeting";
CREATE POLICY meeting_isolation ON "Meeting"
  USING ("userId" = current_setting('app.user_id', true))
  WITH CHECK ("userId" = current_setting('app.user_id', true));

ALTER TABLE "Chat" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Chat" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS chat_isolation ON "Chat";
CREATE POLICY chat_isolation ON "Chat"
  USING ("userId" = current_setting('app.user_id', true))
  WITH CHECK ("userId" = current_setting('app.user_id', true));

ALTER TABLE "Routine" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Routine" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS routine_isolation ON "Routine";
CREATE POLICY routine_isolation ON "Routine"
  USING ("userId" = current_setting('app.user_id', true))
  WITH CHECK ("userId" = current_setting('app.user_id', true));

ALTER TABLE "Integration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Integration" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS integration_isolation ON "Integration";
CREATE POLICY integration_isolation ON "Integration"
  USING ("userId" = current_setting('app.user_id', true))
  WITH CHECK ("userId" = current_setting('app.user_id', true));
