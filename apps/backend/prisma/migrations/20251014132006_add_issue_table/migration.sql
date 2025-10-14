-- CreateTable
CREATE TABLE "project" (
    "id" SERIAL NOT NULL,
    "server_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issue" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "priority" VARCHAR(20),
    "status_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_issues" (
    "project_id" INTEGER NOT NULL,
    "issue_id" INTEGER NOT NULL,

    CONSTRAINT "project_issues_pkey" PRIMARY KEY ("project_id","issue_id")
);

-- CreateTable
CREATE TABLE "chat_issues" (
    "chat_id" INTEGER NOT NULL,
    "issue_id" INTEGER NOT NULL,

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
    "issue_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "issue_assignee_pkey" PRIMARY KEY ("issue_id","user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "issue_status_name_key" ON "issue_status"("name");

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue" ADD CONSTRAINT "issue_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "issue_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
