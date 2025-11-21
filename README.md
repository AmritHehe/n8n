
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

## Architecture

```svg
<svg width="860" height="650" viewBox="0 0 860 650" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Arial, sans-serif">
  <rect width="860" height="650" fill="#ffffff" stroke="#D1D5DB" stroke-width="2"/>
  <rect x="85" y="45" width="690" height="150" rx="14" fill="#F3F4F6" stroke="#D1D5DB" stroke-width="2"/>
  <text x="335" y="80" font-size="17" font-weight="600" fill="#333">Presentation Layer (Vercel)</text>
  <rect x="155" y="105" width="550" height="70" rx="10" fill="#FFFFFF" stroke="#D1D5DB" stroke-width="1.5"/>
  <text x="323" y="130" font-size="14" font-weight="600" fill="#111">React Flow UI / Workflow Builder</text>
  <text x="265" y="150" font-size="12" fill="#555">Visual Nodes • Connections • Trigger + Action Nodes • Real-time Logs</text>
  <line x1="430" y1="195" x2="430" y2="235" stroke="#9CA3AF" stroke-width="3" marker-end="url(#arrow)"/>
  <rect x="85" y="235" width="690" height="230" rx="14" fill="#F3F4F6" stroke="#D1D5DB" stroke-width="2"/>
  <text x="355" y="270" font-size="17" font-weight="600" fill="#333">Logic Layer (AWS EC2)</text>
  <rect x="155" y="295" width="550" height="70" rx="10" fill="#FFFFFF" stroke="#D1D5DB" stroke-width="1.5"/>
  <text x="363" y="320" font-size="14" font-weight="600" fill="#111">Express API</text>
  <text x="270" y="340" font-size="12" fill="#555">Auth • Workflow CRUD • Credentials • Webhooks (Resume) • Real-time Logs</text>
  <rect x="205" y="370" width="450" height="70" rx="10" fill="#E5E7EB" stroke="#C0C6CC" stroke-width="1.5"/>
  <text x="333" y="395" font-size="14" font-weight="600" fill="#111">Node Execution Engine</text>
  <text x="292" y="415" font-size="11.5" fill="#444">Pre-order Traversal • Per-node Execution • Response Chaining</text>
  <line x1="430" y1="465" x2="430" y2="505" stroke="#9CA3AF" stroke-width="3" marker-end="url(#arrow)"/>
  <rect x="85" y="505" width="690" height="120" rx="14" fill="#F3F4F6" stroke="#D1D5DB" stroke-width="2"/>
  <text x="350" y="540" font-size="17" font-weight="600" fill="#333">Storage Layer (PostgreSQL)</text>
  <rect x="155" y="560" width="550" height="50" rx="10" fill="#FFFFFF" stroke="#D1D5DB" stroke-width="1.5"/>
  <text x="232" y="590" font-size="12" fill="#111">Workflows • Nodes • User Credentials • Persistent Responses (via Prisma)</text>
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="7" refY="5"
      markerWidth="8" markerHeight="8" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L10,5 L0,10 z" fill="#9CA3AF"/>
    </marker>
  </defs>
</svg>
````

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

