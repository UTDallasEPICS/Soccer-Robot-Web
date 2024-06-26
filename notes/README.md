# Documentation

Useful documentation

<!-- markdownlint-disable-next-line MD033 -->
<details><summary><h2>Table of Contents</h2></summary>

- [System Architecture](#system-architecture)
- [Flow Charts](#flow-charts)
- [Sequence Diagrams](#sequence-diagrams)

</details>

## System Architecture

![System Architecture](./assets/system_architecture.png)

### Webpage, Login/Logout

```text
Nuxt handles serving the webpage as well as handling login/logout through Auth0, registering new users in the database.
```

### Broadcast Timer, Score, Queue

```text
Server: Game Manager
Server-sent events that update all clients about the current time, scores, and queue list.
```

### Join/Leave/Confirm Queue

```text
WebSocket Server: Game Manager
Game Manager authenticates HTTP upgrade and handles joining/leaving queue requests. When it is time to start the next game, Game Manager handles sending a confirmation request to the next two players and the accepted/declined response.
```

### Authorize/Unauthorize Players from Controls

```text
HTTP Server: Controller
After two users accept confirmation and before game start, Game Manager will request to authorize those users to send wasd inputs. After game end, Game Manager will request to unauthorize those users from sending wasd inputs.
```

### Start Game, Check Ready, Time/Score Update

```text
WebSocket Server: Raspberry
Before Game Manager attempts to send confirmation requests to next two queue users, Game Manager will ask if Raspberry server is ready. If yes, after setting up players and control authorization, Game Manager will request Raspberry to start the game with a specified time. Raspberry will stream time/scores updates back to Game Manager until time == 0.
```

### Send player inputs

```text
WebSocket Server: Controller (from Client), Raspberry (from Controller)
Controller authenticates HTTP upgrade and handles checking proper wasd inputs (in the regex form [01][01][01][01]). Controller forwards proper wasd inputs and player number to Raspberry. 
```

## Flow Charts

### Game Cycles

```mermaid
flowchart TD
    START-->QueueCheck2
    subgraph NOT_PLAYING
        QueueCheck2{Queue.length >= 2}
        CheckReady{Robots ready}
        QueueCheck2 -- NO --> QueueCheck2
        QueueCheck2 -- YES --> CheckReady
        CheckReady -- NO --> QueueCheck2
    end
    CheckReady -- YES --> SendConfirm
    subgraph SEND_CONFIRM
        SendConfirm[Send confirmation requests]
        ConfirmationTimer{Confirm time over}
        CheckConfirm{2 accepts}
        RemoveDeclined[Remove declined/no response users]
        SendConfirm --> ConfirmationTimer
        ConfirmationTimer -- NO --> ConfirmationTimer
        ConfirmationTimer -- YES --> CheckConfirm
        CheckConfirm -- NO --> RemoveDeclined
    end
    RemoveDeclined --> QueueCheck2
    CheckConfirm -- YES --> ChangeAccessCode
    subgraph PLAYING
        ChangeAccessCode[Change Controller access code]
        ControllerAuthorize[Authorize players]
        SendMatchStart[Give players Controller access code]
        RaspMatchStart[Signal Raspberry to start timer and scores]
        GameOver[Timer == 0]
        ChangeAccessCode --> ControllerAuthorize
        ControllerAuthorize --> SendMatchStart
        SendMatchStart --> RaspMatchStart
        RaspMatchStart --> GameOver
        GameOver -- NO --> GameOver
    end
    GameOver -- YES --> ControllerUnauthorize
    subgraph RESETTING
        ControllerUnauthorize[Unauthorize players]
        StoreMatch[Store match datetime, players, and scores in database]
        Reset[Reset timer, score, and robot_ready state]
        ControllerUnauthorize --> StoreMatch
        StoreMatch --> Reset
    end
    Reset --> QueueCheck2
```

## Sequence Diagrams

### Queue Interaction

```mermaid
sequenceDiagram
    participant User
    participant Game Manager
    participant Database
    User->>Game Manager: HTTP to WebSocket upgrade (cookie: srtoken)
    Game Manager-)Database: isRegistered(user_id)
    Database-->>Game Manager: user exists
    Game Manager-->>User: WebSocket upgrade
    User->>Game Manager: JOIN_QUEUE
    Note over Game Manager, User: Need to wait until next in queue
    loop while next in queue and need all players accepted
        Game Manager-->>User: MATCH_CONFIRMATION (CONFIRMATION_PASSWORD)
        User->>Game Manager: CONFIRMATION (CONFIRMATION_PASSWORD)
    end
    Note over Game Manager, User: Ready to play
    Game Manager-->>User: MATCH_START (CONTROLLER_ACCESS)
```
