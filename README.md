# Soccer Robots CS (UTDesign EPICS

<!-- markdownlint-disable-next-line MD033 -->
<details><summary><h2>Table of Contents</h2></summary>

- [Conceptual Overview](#conceptual-overview)
- [Functional Requirements](#functional-requirements)
- [Third Party Integrations](#third-party-integrations)
- [Tech Stack](#tech-stack)
- [Deployment Notes](#deployment-notes)
- [Migration Scripts](#migration-scripts)
- [Setting Up Development Environment](#setting-up-development-environment)

</details>

## Conceptual Overview

## Functional Requirements

### Project Goals

For this semester, implement a website for the UTDesign Soccer Robots, map controls, and store data

### Website

- Homepage with spectator view, player view
- Register an account
- Login System
- How to play section
  - Include a contact email for assistance
- Game Information (Match status, score, timer, who is playing, who is in queue)
- Video feed (one camera, probably bird-eye view)

### Game

- Queue system (join queue, leave queue)
  - 1v1
- Display timer (time is based on settings)
- Display score
- Display players
- Map user input to control actions (that the engineering team makes)
- Work with the engineering team to recharge robots before a game

### Data Storage

- Account information (email, country (default US), unique username)
- Match information (Players, match results)

### Admin View

- Set settings in timer
- See statistics

### Notes from Taz Conversation

- Twitch Stream
- Web sockets/web rtc
- SSG mode
- Separate server for controls
- NodeUSB, NodeHSB, - Bluetooth in JS

## Third Party Integrations

## Tech Stack

Still up for debate, but probably these:

- Nuxt.js
- Node
- PostgreSQL and Prisma
- Auth0

## Deployment Notes

## Migration Scripts

## Setting Up Development Environment
