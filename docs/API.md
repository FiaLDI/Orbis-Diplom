# Orbis-Diplom API Documentation

Base URL in local development:

```text
https://localhost:4000
```

Base URL through production nginx:

```text
https://localhost
```

Most protected REST endpoints require:

```http
Authorization: Bearer <access_token>
```

The frontend also sends credentials/cookies for auth-related requests.

## Auth

Mounted at `/api/auth`.

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/send-code` | No | Send verification code. |
| `POST` | `/api/auth/verify-code` | No | Verify code. |
| `POST` | `/api/auth/register` | No | Register user. |
| `POST` | `/api/auth/login` | No | Login and issue tokens. |
| `POST` | `/api/auth/refresh` | Cookie/refresh token | Refresh access token. |
| `POST` | `/api/auth/logout` | No | Logout. |

## Users

Mounted at `/api/users`.

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/users/chats` | Yes | Get current user's chats. |
| `GET` | `/api/users/search?name=<value>` | Yes | Search users. |
| `GET` | `/api/users/:id` | Yes | Get profile by user id. |
| `PUT` | `/api/users/:id` | Yes | Update user. |
| `DELETE` | `/api/users/:id` | Yes | Delete current user. |

## Friends

Mounted at `/api/friends`.

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/friends/` | Yes | Get friends. |
| `GET` | `/api/friends/requests` | Yes | Get friend requests. |
| `GET` | `/api/friends/blocked` | Yes | Get blocked users. |
| `GET` | `/api/friends/:id/status` | Yes | Get relationship status. |
| `POST` | `/api/friends/:id/invite` | Yes | Send friend invite. |
| `POST` | `/api/friends/:id/confirm` | Yes | Accept invite. |
| `POST` | `/api/friends/:id/reject` | Yes | Reject invite. |
| `POST` | `/api/friends/:id/block` | Yes | Block user. |
| `POST` | `/api/friends/:id/unblock` | Yes | Unblock user. |
| `DELETE` | `/api/friends/:id` | Yes | Remove friend. |

## Chats

Mounted at `/api/chats`.

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/chats/start/:id` | Yes | Start personal chat with user id. |
| `PUT` | `/api/chats/:id` | Yes | Update chat. |
| `DELETE` | `/api/chats/:id` | Yes | Delete chat. |

## Messages

Mounted at `/api/messages`.

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/messages/chats/:id/messages` | Yes | Get chat messages. |
| `POST` | `/api/messages/chats/:id/messages` | Yes | Send message to chat. |
| `GET` | `/api/messages/:id` | Yes | Get message by id. |
| `PUT` | `/api/messages/:id` | Yes | Edit message. |
| `DELETE` | `/api/messages/:id` | Yes | Delete message. |

## Notifications

Mounted at `/api/notifications`.

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/notifications/` | Yes | Get notifications. |
| `PUT` | `/api/notifications/:id/read` | Yes | Mark one notification as read. |
| `DELETE` | `/api/notifications/:id` | Yes | Delete one notification. |
| `PUT` | `/api/notifications/read` | Yes | Mark all notifications as read. |
| `DELETE` | `/api/notifications/` | Yes | Delete all notifications. |

## Servers

Mounted at `/api/servers`.

| Method | Route | Auth | Permission |
| --- | --- | --- | --- |
| `GET` | `/api/servers` | Yes | User membership |
| `POST` | `/api/servers` | Yes | Authenticated |
| `POST` | `/api/servers/join` | Yes | Authenticated |
| `GET` | `/api/servers/:id` | Yes | Authenticated |
| `PATCH` | `/api/servers/:id` | Yes | `MANAGE_SERVER` |
| `DELETE` | `/api/servers/:id` | Yes | `MANAGE_SERVER` |
| `GET` | `/api/servers/:id/members` | Yes | Authenticated |
| `DELETE` | `/api/servers/:id/members/:userId` | Yes | `KICK_USERS` |
| `POST` | `/api/servers/:id/members/:userId/ban` | Yes | `BAN_USERS` |
| `DELETE` | `/api/servers/:id/members/:userId/ban` | Yes | `UNBAN_USERS` |
| `GET` | `/api/servers/:id/chats` | Yes | `VIEW_CHATS` |
| `POST` | `/api/servers/:id/chats` | Yes | `MANAGE_CHATS` |
| `GET` | `/api/servers/:id/chats/:chatId` | Yes | `VIEW_CHATS` |
| `DELETE` | `/api/servers/:id/chats/:chatId` | Yes | `MANAGE_CHATS` |
| `GET` | `/api/servers/:id/link` | Yes | `MANAGE_INVITES` |
| `POST` | `/api/servers/:id/link` | Yes | `MANAGE_INVITES` |
| `DELETE` | `/api/servers/:id/link` | Yes | `MANAGE_INVITES` |

## Roles

Mounted at `/api/servers`.

| Method | Route | Auth | Permission |
| --- | --- | --- | --- |
| `GET` | `/api/servers/:id/roles` | Yes | Authenticated |
| `POST` | `/api/servers/:id/roles` | Yes | `MANAGE_ROLES` |
| `PATCH` | `/api/servers/:id/roles/:roleId` | Yes | `MANAGE_ROLES` |
| `DELETE` | `/api/servers/:id/roles/:roleId` | Yes | `MANAGE_ROLES` |
| `POST` | `/api/servers/:id/members/:userId/roles/:roleId` | Yes | `MANAGE_ROLES` |
| `DELETE` | `/api/servers/:id/members/:userId/roles/:roleId` | Yes | `MANAGE_ROLES` |
| `GET` | `/api/servers/:id/roles/:roleId/permissions` | Yes | Authenticated |
| `PATCH` | `/api/servers/:id/roles/:roleId/permissions` | Yes | `MANAGE_ROLES` |
| `GET` | `/api/servers/roles/permissions` | Yes | Authenticated |

Seeded permissions:

```text
ADMIN
MANAGE_SERVER
MANAGE_ROLES
MANAGE_CHATS
KICK_USERS
BAN_USERS
UNBAN_USERS
MANAGE_MESSAGES
SEND_MESSAGES
MANAGE_INVITES
VIEW_CHATS
MANAGE_PROJECT
VIEW_PROJECTS
MANAGE_ISSUE
VIEW_ISSUES
MANAGE_ASSIGNEES
VIEW_BANS
```

## Planning

Mounted at `/api/servers`.

| Method | Route | Auth | Permission |
| --- | --- | --- | --- |
| `GET` | `/api/servers/:serverId/issues/statuses` | Yes | `VIEW_ISSUES` |
| `GET` | `/api/servers/:serverId/issues/priorities` | Yes | `VIEW_ISSUES` |
| `GET` | `/api/servers/:serverId/projects` | Yes | `VIEW_PROJECTS` |
| `POST` | `/api/servers/:serverId/projects` | Yes | `MANAGE_PROJECT` |
| `PATCH` | `/api/servers/:serverId/projects/:projectId` | Yes | `MANAGE_PROJECT` |
| `DELETE` | `/api/servers/:serverId/projects/:projectId` | Yes | `MANAGE_PROJECT` |
| `GET` | `/api/servers/:serverId/projects/:projectId/issues` | Yes | `VIEW_ISSUES` |
| `POST` | `/api/servers/:serverId/projects/:projectId/issues` | Yes | `MANAGE_ISSUE` |
| `GET` | `/api/servers/:serverId/issues/:issueId` | Yes | `VIEW_ISSUES` |
| `PATCH` | `/api/servers/:serverId/issues/:issueId` | Yes | `MANAGE_ISSUE` |
| `DELETE` | `/api/servers/:serverId/issues/:issueId` | Yes | `MANAGE_ISSUE` |
| `POST` | `/api/servers/:serverId/issues/:issueId/assignees/:userId` | Yes | `MANAGE_ASSIGNEES` |
| `DELETE` | `/api/servers/:serverId/issues/:issueId/assignees/:userId` | Yes | `MANAGE_ASSIGNEES` |
| `GET` | `/api/servers/:serverId/issues/:issueId/chats` | Yes | `VIEW_ISSUES` |
| `POST` | `/api/servers/:serverId/issues/:issueId/chats` | Yes | `MANAGE_ISSUE` |
| `DELETE` | `/api/servers/:serverId/issues/:issueId/chats/:chatId` | Yes | `MANAGE_ISSUE` |
| `PATCH` | `/api/servers/:serverId/issues/:issueId/chats/:chatId` | Yes | `MANAGE_ISSUE` |

Seeded issue statuses:

```text
Open
In Progress
Review
Done
Closed
```

Issue priorities:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

## Moderation

Mounted at `/api/servers`.

| Method | Route | Auth | Permission |
| --- | --- | --- | --- |
| `GET` | `/api/servers/:serverId/moderation/logs` | Yes | `VIEW_AUDIT_LOGS` |
| `GET` | `/api/servers/:serverId/moderation/bans` | Yes | `VIEW_BANS` |
| `POST` | `/api/servers/:serverId/moderation/bans/:userId` | Yes | `BAN_USERS` |
| `DELETE` | `/api/servers/:serverId/moderation/bans/:userId` | Yes | `BAN_USERS` |
| `DELETE` | `/api/servers/:serverId/moderation/kicks/:userId` | Yes | `KICK_USERS` |

## Socket.IO

Socket base URL is the same backend origin.

Development:

```text
https://localhost:4000
```

Production through nginx:

```text
https://localhost
```

Namespaces:

| Namespace | Purpose |
| --- | --- |
| `/chat` | Chat rooms, messages, typing-related events. |
| `/notification` | User notifications and presence-related updates. |
| `/journal` | Server/project/chat state updates. |

All namespaces use JWT socket authentication.

## CDN API

Development CDN base URL:

```text
https://localhost:4005
```

Production through nginx:

```text
https://localhost
```

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/upload` | Upload up to 5 files. |
| `GET` | `/cdn/:folder?/:filename` | Read uploaded/static files. |
| `GET` | `/media/:filename` | Stream media with range support. |
| `GET` | `/download?url=<encoded-url>` | Proxy download for an external URL. |

Production nginx proxies `/cdn`, `/upload`, and `/download` to the CDN container.
