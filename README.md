# Soccer Robots CS (UTDesign EPICS)

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

## Third Party Integrations

- Auth0 for authentication
- Twitch for live-streaming soccer arena

## Tech Stack

- Nuxt.js
- Node.js
- SQLite and Prisma
- Postman

## Deployment Notes

N/A

## Migration Scripts

N/A

## Setting Up Development Environment

Ensure Node.js, npm, Visual Studio Code, Git, WSL2 (windows only) are installed. Auth0 account is needed.

### Install the repo

```bash
git clone https://github.com/UTDallasEPICS/Soccer-Robot-Web.git
cd Soccer-Robot-Web
npm install
```

### Set up Auth0

In the Auth0 application dashboard, configure the following with the appropriate port. The slashes ```/``` are very important. If using a different host than **localhost**, change **localhost** value accordingly.

- Allowed Callback URLs

```bash
http://localhost:PORT/api/callback
```

- Allowed Logout URLs

```bash
http://localhost:PORT/api/logoutcallback
```

- Allowed Web Origins

```bash
http://localhost:PORT/
```

### Initialize .env variables

Look at **.env.example** for reference. Create an .env file in the root directory filled out with needed information.

#### Some notes

- Some are ports duplicated because I wanted to follow naming convention without NUXT_ prefix. For example, all instances of **PORT2** should be the same port
- **LOCALHOST** can be localhost (for development) or host server's IP address
- **NUXT_AUTH0_CLIENTID**, **NUXT_AUTH0_SECRET**, and **NUXT_ISSUER** depends on Auth0 application
  - The slashes ```/``` are very important.
- **NUXT_CHANNEL_NAME** and **NUXT_PARENT_NAME** depends on Twitch account
- **CONTROLLER_PASSWORD** and **CONTROLLER_ACCESS** are useless because of randomized password rotations :)

### Set up database

```bash
npx prisma migrate dev --name init
```

### Start all servers

**MAKE SURE THE RASPBERRY SERVER IS RUNNING FIRST**.\
Then, in separate terminals, execute the following commands

```bash
# this starts Controller server
npm run bootcontrol
```

```bash
# this starts Game Manager server
npm run bootgame
```

```bash
# this starts Nuxt server
npm run dev
```

### Useful dev tips

#### Prisma GUI to view database

```bash
npx prisma studio
```

#### If exposing host IP address is needed, append ```-- --host```

```bash
npm run bootcontrol -- --host
npm run bootgame -- --host
npm run dev -- --host
```

#### Custom package.json scripts

tsx is used to run Typescript files

```json
"scripts": {
    ...
    "bootgame": "tsx server/Game_Manager/src/index.ts",
    "bootcontrol": "tsx server/Controller/src/index.ts",
    ...
}
```

#### Use Postman to test HTTP and WebSockets

#### Mermaid is useful to document flowcharts and sequence diagrams in markdown

- <https://mermaid.js.org/>
- See ./notes
