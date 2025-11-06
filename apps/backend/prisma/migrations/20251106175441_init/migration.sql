-- CreateEnum
CREATE TYPE "IssuePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

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
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255),
    "username" VARCHAR(255),
    "password_hash" TEXT,
    "number" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "user_id" UUID NOT NULL,
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
    "user_id" UUID NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "birth_date" TIMESTAMP(3),
    "avatar_url" TEXT,
    "gender" VARCHAR(20),
    "location" VARCHAR(100),
    "about" TEXT,
    "is_online" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_profile_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "users_blocks" (
    "id" SERIAL NOT NULL,
    "id_users" UUID NOT NULL,
    "blocked_user_id" UUID NOT NULL,
    "reason_type_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "end_at" TIMESTAMP(3),

    CONSTRAINT "users_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friend_requests" (
    "from_user_id" UUID NOT NULL,
    "to_user_id" UUID NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "friend_requests_pkey" PRIMARY KEY ("from_user_id","to_user_id")
);

-- CreateTable
CREATE TABLE "servers" (
    "id" UUID NOT NULL,
    "creator_id" UUID,
    "name" VARCHAR(100) NOT NULL,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "servers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_server" (
    "id" UUID NOT NULL,
    "server_id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "color" VARCHAR(7),

    CONSTRAINT "role_server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permission" (
    "role_id" UUID NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "granted_at" TIMESTAMP(3),

    CONSTRAINT "role_permission_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "user_server" (
    "user_id" UUID NOT NULL,
    "server_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "user_server_pkey" PRIMARY KEY ("user_id","server_id")
);

-- CreateTable
CREATE TABLE "user_server_roles" (
    "user_id" UUID NOT NULL,
    "server_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,

    CONSTRAINT "user_server_roles_pkey" PRIMARY KEY ("user_id","server_id","role_id")
);

-- CreateTable
CREATE TABLE "server_bans" (
    "server_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "banned_by" UUID,

    CONSTRAINT "server_bans_pkey" PRIMARY KEY ("server_id","user_id")
);

-- CreateTable
CREATE TABLE "invites" (
    "code" TEXT NOT NULL,
    "server_id" UUID NOT NULL,
    "creator_id" UUID NOT NULL,
    "expires_at" TIMESTAMP(3),
    "max_uses" INTEGER,
    "uses" INTEGER NOT NULL DEFAULT 0,
    "is_revoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "invites_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" UUID NOT NULL,
    "creator_id" UUID,
    "created_at" TIMESTAMP(3),
    "name" TEXT,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server_chats" (
    "id_server" UUID NOT NULL,
    "id_chats" UUID NOT NULL,

    CONSTRAINT "server_chats_pkey" PRIMARY KEY ("id_server","id_chats")
);

-- CreateTable
CREATE TABLE "chat_users" (
    "user_id" UUID NOT NULL,
    "chat_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "chat_users_pkey" PRIMARY KEY ("user_id","chat_id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "chat_id" UUID,
    "user_id" UUID,
    "reply_to_id" UUID,
    "is_edited" BOOLEAN,
    "updated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3),
    "content_text" TEXT,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content" (
    "id" UUID NOT NULL,
    "text" TEXT,
    "url" TEXT,

    CONSTRAINT "content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages_content" (
    "id_messages" UUID NOT NULL,
    "type" VARCHAR(50),
    "size" INTEGER,
    "uploaded_at" TIMESTAMP(3),
    "id_content" UUID NOT NULL,

    CONSTRAINT "messages_content_pkey" PRIMARY KEY ("id_messages","id_content")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "server_id" UUID NOT NULL,
    "actor_id" UUID NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "target_id" TEXT,
    "metadata" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_reads" (
    "user_id" UUID NOT NULL,
    "chat_id" UUID NOT NULL,
    "last_read_message_id" UUID,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_reads_pkey" PRIMARY KEY ("user_id","chat_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "body" TEXT,
    "data" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" UUID NOT NULL,
    "server_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issue" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "priority" "IssuePriority" NOT NULL DEFAULT 'MEDIUM',
    "status_id" INTEGER NOT NULL,
    "due_date" TIMESTAMP(3),
    "parent_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_issues" (
    "project_id" UUID NOT NULL,
    "issue_id" UUID NOT NULL,

    CONSTRAINT "project_issues_pkey" PRIMARY KEY ("project_id","issue_id")
);

-- CreateTable
CREATE TABLE "chat_issues" (
    "chat_id" UUID NOT NULL,
    "issue_id" UUID NOT NULL,

    CONSTRAINT "chat_issues_pkey" PRIMARY KEY ("chat_id","issue_id")
);

-- CreateTable
CREATE TABLE "issue_status" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "issue_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issue_assignee" (
    "issue_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "issue_assignee_pkey" PRIMARY KEY ("issue_id","user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permission_type_name_key" ON "permission_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_blocks_id_users_blocked_user_id_key" ON "users_blocks"("id_users", "blocked_user_id");

-- CreateIndex
CREATE INDEX "role_server_server_id_idx" ON "role_server"("server_id");

-- CreateIndex
CREATE INDEX "role_permission_role_id_idx" ON "role_permission"("role_id");

-- CreateIndex
CREATE INDEX "role_permission_permission_id_idx" ON "role_permission"("permission_id");

-- CreateIndex
CREATE INDEX "user_server_server_id_idx" ON "user_server"("server_id");

-- CreateIndex
CREATE INDEX "user_server_roles_role_id_idx" ON "user_server_roles"("role_id");

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
CREATE INDEX "messages_chat_id_created_at_idx" ON "messages"("chat_id", "created_at");

-- CreateIndex
CREATE INDEX "messages_user_id_created_at_idx" ON "messages"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "messages_content_text_idx" ON "messages"("content_text");

-- CreateIndex
CREATE INDEX "audit_logs_server_id_created_at_idx" ON "audit_logs"("server_id", "created_at");

-- CreateIndex
CREATE INDEX "message_reads_chat_id_idx" ON "message_reads"("chat_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "issue_status_name_key" ON "issue_status"("name");

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_blocks" ADD CONSTRAINT "users_blocks_id_users_fkey" FOREIGN KEY ("id_users") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_blocks" ADD CONSTRAINT "users_blocks_blocked_user_id_fkey" FOREIGN KEY ("blocked_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_blocks" ADD CONSTRAINT "users_blocks_reason_type_id_fkey" FOREIGN KEY ("reason_type_id") REFERENCES "block_reason_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servers" ADD CONSTRAINT "servers_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_server" ADD CONSTRAINT "role_server_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role_server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permission_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_server" ADD CONSTRAINT "user_server_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_server" ADD CONSTRAINT "user_server_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_server_roles" ADD CONSTRAINT "user_server_roles_user_id_server_id_fkey" FOREIGN KEY ("user_id", "server_id") REFERENCES "user_server"("user_id", "server_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_server_roles" ADD CONSTRAINT "user_server_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role_server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "message_reads" ADD CONSTRAINT "message_reads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_reads" ADD CONSTRAINT "message_reads_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue" ADD CONSTRAINT "issue_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "issue_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue" ADD CONSTRAINT "issue_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "issue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_issues" ADD CONSTRAINT "project_issues_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_issues" ADD CONSTRAINT "project_issues_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_issues" ADD CONSTRAINT "chat_issues_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_issues" ADD CONSTRAINT "chat_issues_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_assignee" ADD CONSTRAINT "issue_assignee_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_assignee" ADD CONSTRAINT "issue_assignee_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
