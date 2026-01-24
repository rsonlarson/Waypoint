CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "ride_id" uuid NOT NULL,
    "sender_id" uuid NOT NULL,
    "content" text NOT NULL,
    CONSTRAINT "messages_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "messages_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "public"."rides"("id") ON DELETE CASCADE,
    CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE
);

ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages for their rides" ON "public"."messages"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "public"."rides" r
            WHERE r."id" = "messages"."ride_id"
            AND (r."driver_id" = auth.uid() OR EXISTS (
                SELECT 1 FROM "public"."ride_requests" rr
                WHERE rr."ride_id" = r."id" AND rr."rider_id" = auth.uid() AND rr."status" = 'accepted'
            ))
        )
    );

CREATE POLICY "Users can send messages to their rides" ON "public"."messages"
    FOR INSERT WITH CHECK (
        auth.uid() = "sender_id" AND
        EXISTS (
            SELECT 1 FROM "public"."rides" r
            WHERE r."id" = "messages"."ride_id"
            AND (r."driver_id" = auth.uid() OR EXISTS (
                SELECT 1 FROM "public"."ride_requests" rr
                WHERE rr."ride_id" = r."id" AND rr."rider_id" = auth.uid() AND rr."status" = 'accepted'
            ))
        )
    );
