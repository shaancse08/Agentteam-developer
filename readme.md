# agentteam-developer

Part of the **AgentTeam** multi-agent ecosystem — a Developer Agent built on SAP CAP (Node.js/TypeScript) and LangGraph, capable of exploring a target codebase, recalling relevant history, generating code changes, writing them to disk, and verifying its own work through real command execution (type-checking/tests) — retrying autonomously on failure before escalating.

This agent is designed to be called by a Scrum Master agent (separate repo) as part of a larger multi-agent development pipeline, but also runs and is testable fully standalone.

## Architecture

**Stack:** SAP CAP (Node.js/TypeScript), LangGraph (`StateGraph`), LangChain tools, SAP AI Core / OpenAI (via `model-factory.ts`)

**Core idea:** every task (a code change request) flows through a fixed graph of nodes, each doing one clearly bounded job, with every step logged to a persistent audit trail (`TaskLogs`) — so the agent's behavior is fully explainable and reconstructable after the fact, not a black box.

### Graph flow

\`\`\`
explore → recallHistory → select → read → generate → write → verify
↑ │
└──── retry (max 3) ┘
│
pass/exhausted → completed/failed
\`\`\`

| Node            | Responsibility                                                           |
| --------------- | ------------------------------------------------------------------------ |
| `explore`       | List all files under the target codebase (`TARGET_REPO_PATH`)            |
| `recallHistory` | Surface summaries of past completed tasks for this project, for context  |
| `select`        | LLM decides which file(s) from the codebase are relevant to the task     |
| `read`          | Read the selected file(s) into state                                     |
| `generate`      | LLM produces proposed code changes (full file content per selected path) |
| `write`         | Write the proposed changes to disk                                       |
| `verify`        | Run real type-check/test commands against the changed code               |

On verification failure, the graph loops back to `generate` with the failure output as context, up to `maxRetries` (default 3), before marking the task `failed` and (in later versions) escalating to a human.

## Folder structure

\`\`\`
db/
com.devagent.cds — Tasks / TaskLogs entities
com.reusable.cds — shared Status enum
srv/
developer-service.cds — service definition (generateCode action)
src/
developer-service.ts — thin CAP service router
handler/ — CAP-facing orchestration (DB reads/writes, logging, invokes the graph)
lib/ — pure agent/graph logic, no CDS dependency
state.ts — DeveloperState (LangGraph Annotation schema)
node.ts — the six graph nodes
graph.ts — StateGraph wiring: nodes, edges, conditional retry routing
tools.ts — listFiles, readFile, writeFile, runTypeCheck/runTests
model-factory.ts — LLM client factory (SAP AI Core / OpenAI)
\`\`\`

**Design principle:** `lib/` never imports `@sap/cds`. All persistence (creating `Tasks` rows, writing `TaskLogs`, reading history) is owned by `handler/`, which calls into `lib/` as a pure function boundary. This keeps the agent logic testable and portable independent of CAP.

## Data model

- **`Tasks`** — one row per code-change request: description, project name, target file path, status, generated code, explanation, error message
- **`TaskLogs`** — append-only audit trail, one or more rows per task, one per meaningful event (`files_listed`, `files_selected`, `file_read`, `llm_call_started`/`completed`, `code_written`, `command_executed`/`result`, `error`). This table is the source of truth for _why_ the agent did what it did.

## Environment

\`\`\`
TARGET_REPO_PATH=/absolute/path/to/target/codebase
\`\`\`
(LLM provider config handled via `model-factory.ts` — SAP AI Core on office setup, OpenAI fallback locally.)

## Running locally

\`\`\`bash
cds watch --port 4001
\`\`\`

Test via `srv/test.http` (or equivalent `.http` file) against the `generateCode` action.

## Status

🚧 Under active development — built incrementally, node by node, as a learning project. This README is updated after each node/milestone is completed.

### Progress log

- [x] CDS schema (`Tasks`, `TaskLogs`, shared `Status` enum)
- [x] `DeveloperState` (LangGraph Annotation schema)
- [ ] `explore` node
- [ ] `recallHistory` node
- [ ] `select` node
- [ ] `read` node
- [ ] `generate` node
- [ ] `write` node
- [ ] `verify` node + retry routing
- [ ] Reusable `logEvent` + node-logging wrapper
- [ ] End-to-end test via `.http`
- [ ] A2A wrapping (v2)

## Part of AgentTeam

| Repo                     | Role                                                              |
| ------------------------ | ----------------------------------------------------------------- |
| `agentteam-developer`    | This repo — writes and verifies code                              |
| `agentteam-scrum-master` | Orchestrator — assigns tasks, tracks tickets, escalates to humans |
| `agentteam-qa`           | Independent verification/testing agent                            |
