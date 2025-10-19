-- CreateTable
CREATE TABLE "block_reason_type" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "block_reason_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission_type" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "permission_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings_type" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "settings_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255),
    "username" VARCHAR(255),
    "password_hash" TEXT,
    "number" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "user_id" INTEGER NOT NULL,
    "privacy_settings" TEXT,
    "timezone" VARCHAR(50),
    "theme" VARCHAR(20),
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "confirmed_at" TIMESTAMP(3),

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_profile" (
    "user_id" INTEGER NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "birth_date" TIMESTAMP(3),
    "avatar_url" TEXT,
    "gender" VARCHAR(20),
    "location" VARCHAR(100),
    "about" TEXT,

    CONSTRAINT "user_profile_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "users_blocks" (
    "id_users" INTEGER NOT NULL,
    "reason_type_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3),
    "end_at" TIMESTAMP(3),

    CONSTRAINT "users_blocks_pkey" PRIMARY KEY ("id_users","reason_type_id")
);

-- CreateTable
CREATE TABLE "friend_requests" (
    "from_user_id" INTEGER NOT NULL,
    "to_user_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "friend_requests_pkey" PRIMARY KEY ("from_user_id","to_user_id")
);

-- CreateTable
CREATE TABLE "servers" (
    "id" SERIAL NOT NULL,
    "creator_id" INTEGER,
    "name" VARCHAR(100) NOT NULL,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "servers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_server" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "role_server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permission" (
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "granted_at" TIMESTAMP(3),

    CONSTRAINT "role_permission_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "user_server" (
    "user_id" INTEGER NOT NULL,
    "server_id" INTEGER NOT NULL,
    "role_id" INTEGER,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "user_server_pkey" PRIMARY KEY ("user_id","server_id")
);

-- CreateTable
CREATE TABLE "server_bans" (
    "server_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "banned_by" INTEGER,

    CONSTRAINT "server_bans_pkey" PRIMARY KEY ("server_id","user_id")
);

-- CreateTable
CREATE TABLE "invites" (
    "code" TEXT NOT NULL,
    "server_id" INTEGER NOT NULL,
    "creator_id" INTEGER NOT NULL,
    "expires_at" TIMESTAMP(3),
    "max_uses" INTEGER,
    "uses" INTEGER NOT NULL DEFAULT 0,
    "is_revoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "invites_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" SERIAL NOT NULL,
    "creator_id" INTEGER,
    "created_at" TIMESTAMP(3),
    "name" TEXT,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server_chats" (
    "id_server" INTEGER NOT NULL,
    "id_chats" INTEGER NOT NULL,

    CONSTRAINT "server_chats_pkey" PRIMARY KEY ("id_server","id_chats")
);

-- CreateTable
CREATE TABLE "chat_users" (
    "user_id" INTEGER NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "role_id" INTEGER,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "chat_users_pkey" PRIMARY KEY ("user_id","chat_id")
);

-- CreateTable
CREATE TABLE "role_chat" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "role_chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_settings" (
    "id_chats" INTEGER NOT NULL,
    "id_settings_type" INTEGER NOT NULL,
    "value" TEXT,

    CONSTRAINT "chat_settings_pkey" PRIMARY KEY ("id_chats","id_settings_type")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "chat_id" INTEGER,
    "user_id" INTEGER,
    "reply_to_id" INTEGER,
    "is_edited" BOOLEAN,
    "updated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3),
    "content_text" TEXT,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content" (
    "id" TEXT NOT NULL,
    "text" TEXT,
    "url" TEXT,

    CONSTRAINT "content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages_content" (
    "id_messages" INTEGER NOT NULL,
    "type" VARCHAR(50),
    "size" INTEGER,
    "uploaded_at" TIMESTAMP(3),
    "id_content" TEXT NOT NULL,

    CONSTRAINT "messages_content_pkey" PRIMARY KEY ("id_messages","id_content")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "server_id" INTEGER NOT NULL,
    "actor_id" INTEGER NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "target_id" TEXT,
    "metadata" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" SERIAL NOT NULL,
    "server_id" INTEGER NOT NULL,
    "message_id" INTEGER,
    "reporter_id" INTEGER NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "resolved_by" INTEGER,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_reads" (
    "user_id" INTEGER NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "last_read_message_id" INTEGER,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_reads_pkey" PRIMARY KEY ("user_id","chat_id")
);

-- CreateTable
CREATE TABLE "push_subscriptions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "push_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "role_permission_role_id_idx" ON "role_permission"("role_id");

-- CreateIndex
CREATE INDEX "role_permission_permission_id_idx" ON "role_permission"("permission_id");

-- CreateIndex
CREATE INDEX "user_server_server_id_idx" ON "user_server"("server_id");

-- CreateIndex
CREATE INDEX "user_server_role_id_idx" ON "user_server"("role_id");

-- CreateIndex
CREATE INDEX "server_bans_user_id_idx" ON "server_bans"("user_id");

-- CreateIndex
CREATE INDEX "invites_server_id_idx" ON "invites"("server_id");

-- CreateIndex
CREATE INDEX "server_chats_id_server_idx" ON "server_chats"("id_server");

-- CreateIndex
CREATE INDEX "server_chats_id_chats_idx" ON "server_chats"("id_chats");

-- CreateIndex
CREATE INDEX "chat_users_chat_id_idx" ON "chat_users"("chat_id");

-- CreateIndex
CREATE INDEX "chat_users_role_id_idx" ON "chat_users"("role_id");

-- CreateIndex
CREATE INDEX "messages_chat_id_created_at_idx" ON "messages"("chat_id", "created_at");

-- CreateIndex
CREATE INDEX "messages_user_id_created_at_idx" ON "messages"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "messages_content_text_idx" ON "messages"("content_text");

-- CreateIndex
CREATE INDEX "audit_logs_server_id_created_at_idx" ON "audit_logs"("server_id", "created_at");

-- CreateIndex
CREATE INDEX "reports_server_id_status_idx" ON "reports"("server_id", "status");

-- CreateIndex
CREATE INDEX "message_reads_chat_id_idx" ON "message_reads"("chat_id");

-- CreateIndex
CREATE INDEX "push_subscriptions_user_id_idx" ON "push_subscriptions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "push_subscriptions_user_id_endpoint_key" ON "push_subscriptions"("user_id", "endpoint");

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_blocks" ADD CONSTRAINT "users_blocks_id_users_fkey" FOREIGN KEY ("id_users") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_blocks" ADD CONSTRAINT "users_blocks_reason_type_id_fkey" FOREIGN KEY ("reason_type_id") REFERENCES "block_reason_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servers" ADD CONSTRAINT "servers_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role_server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permission_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_server" ADD CONSTRAINT "user_server_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_server" ADD CONSTRAINT "user_server_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_server" ADD CONSTRAINT "user_server_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role_server"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_bans" ADD CONSTRAINT "server_bans_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_bans" ADD CONSTRAINT "server_bans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_bans" ADD CONSTRAINT "server_bans_banned_by_fkey" FOREIGN KEY ("banned_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_chats" ADD CONSTRAINT "server_chats_id_server_fkey" FOREIGN KEY ("id_server") REFERENCES "servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_chats" ADD CONSTRAINT "server_chats_id_chats_fkey" FOREIGN KEY ("id_chats") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_users" ADD CONSTRAINT "chat_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_users" ADD CONSTRAINT "chat_users_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_users" ADD CONSTRAINT "chat_users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role_chat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_settings" ADD CONSTRAINT "chat_settings_id_chats_fkey" FOREIGN KEY ("id_chats") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_settings" ADD CONSTRAINT "chat_settings_id_settings_type_fkey" FOREIGN KEY ("id_settings_type") REFERENCES "settings_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_reply_to_id_fkey" FOREIGN KEY ("reply_to_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages_content" ADD CONSTRAINT "messages_content_id_messages_fkey" FOREIGN KEY ("id_messages") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages_content" ADD CONSTRAINT "messages_content_id_content_fkey" FOREIGN KEY ("id_content") REFERENCES "content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_resolved_by_fkey" FOREIGN KEY ("resolved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_reads" ADD CONSTRAINT "message_reads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_reads" ADD CONSTRAINT "message_reads_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
