
# Autm8n — Visual Workflow Automation with AI and Integrations

Autm8n is a lightweight open-source automation tool inspired by n8n and Zapier. It allows users to visually create workflow automations using triggers, actions, and AI agents, without writing backend code. Workflows can trigger webhooks, send Telegram messages, send Gmail emails, or generate responses using AI.

The system supports stateful execution, response chaining between nodes, credential management per user, and webhook-based resume functionality.

---

## Features

- Visual workflow builder using React Flow
- Trigger-based execution (webhooks)
- Telegram message action
- Gmail email action
- AI Agent response generation
- User-specific credential storage
- Node-to-node response passing
- Real-time execution logs
- Persistent response storage (PostgreSQL)
- Deployable on AWS EC2 + Vercel

---

## Architecture Overview
 ┌───────────────┐       ┌──────────────┐        ┌───────────────┐
 │  React Flow UI │ ---> │  Express API │ -----> │ PostgreSQL DB  │
 └───────▲────────┘       └──────┬──────┘        └──────▲────────┘
         │                        │                       │
         │   Websocket Logs       │                       │
         │                        │                       │
         │                        ▼                       │
         └──────────── Executions Engine ─────────────────┘
                      (Node-by-node traversal)

Workflows saved as JSON (nodes + connections)

Executed on EC2 server using pre-order traversal

Execution can pause on webhook triggers and resume later when webhook will be triggered

Outputs persisted in responses table for chaining

SSE for realtime updates from server


---

## Tech Stack

| Area       | Technology                             |
| ---------- | -------------------------------------- |
| Frontend   | Next.js, TypeScript, React Flow        |
| Backend    | Node.js, Express, TypeScript           |
| Database   | PostgreSQL, Prisma                     |
| Auth       | Token-based authentication             |
| Deployment | Frontend on Vercel, Backend on AWS EC2 |
| Logging    | Real-time streaming from server        |
| AI         | Generative AI integration              |

---

## Node Types

| Node            | Description                                                 |
| --------------- | ----------------------------------------------------------- |
| Trigger         | Initiates a workflow (webhook based)                        |
| Telegram Action | Sends a Telegram message using saved credentials            |
| Gmail Action    | Sends an email using stored user Gmail OAuth credentials    |
| AI Agent        | Generates dynamic output which can be passed to other nodes |

---

## Setup Instructions

### Clone the repository

```
git clone https://github.com/AmritHehe/n8n.git
cd n8n
```

### Install dependencies

```
npm install
```

### Setup environment variables

Create `.env` in:

* `/apps/backend`
* `/packages/database`

Required values:

```
DATABASE_URL="postgresql://..."
JWT_SECRET="any_secret_value"
TELEGRAM_BOT_TOKEN="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
AI_API_KEY="..."
```

### Run locally

```
npm run dev
```

---

## Security Notes

* Credentials are stored per user and must not be logged.
* Never commit environment variables.
* All outbound execution must validate credentials before running.
* Webhooks should be validated to prevent unauthorized triggers.

---

## Roadmap

| Feature                           | Status   |
| --------------------------------- | -------- |
| Real-time Logs                    | Complete |
| Webhook Resume                    | Complete |
| AI Agent Node                     | Complete |
| Node Validation Schema            | Planned  |
| Retry per Node                    | Planned  |
| Queue-based Worker System         | Planned  |
| Multi-workflow Parallel Execution | Planned  |

