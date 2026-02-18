# Mayfly : Anonymous Ephemeral Chat

Mayfly is an anonymous, real-time 1:1 chat application designed around ephemerality and privacy. Users are automatically assigned random usernames on entry, communicate via invite-only rooms, and all data is destroyed after a short lifespan.

No accounts. No message history. No persistence beyond intent.

Mayfly is built for temporary, low-risk communication where conversations are meant to disappear.

## Features

- Anonymous by default — users are assigned random, non-identifying usernames automatically
- Invite-only chat rooms created via shareable URLs
- Real-time 1:1 messaging with low-latency delivery
- Automatic room expiration after 10 minutes
- Manual room destruction available to both participants
- No message history or long-term data storage

## How It Works

When a user opens the site, a random username is generated locally and assigned for the session. A user can create a private room, which generates a unique URL that can be shared with exactly one other participant.

Rooms are time-bound and configured with a strict TTL. Messages exist only within the lifetime of the room and are never persisted beyond that window.

If the room expires or either participant manually destroys it:

- All messages are deleted
- Room state is invalidated
- Active connections are terminated

This ensures conversations leave no recoverable trace.

## Tech Stack

- Framework: Next.js (App Router)
- Frontend: React, TypeScript, Tailwind CSS
- State Management & Data Fetching: @tanstack/react-query
- Realtime Messaging & Storage: Upstash Redis, Upstash Realtime
- Validation: Zod
- Utilities: nanoid, date-fns

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Upstash Redis and Realtime credentials
