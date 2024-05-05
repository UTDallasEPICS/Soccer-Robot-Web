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

## Flow Charts

### Game Cycles

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
