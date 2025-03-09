# Design Diagrams

## System Architecture
```mermaid
graph TD
    Client[Client Browser] --> Next[Next.js Frontend]
    Next --> AR[App Router]
    AR --> Pages[Pages]
    AR --> API[API Routes]
    API --> Auth[Auth Service]
    API --> DB[(Database)]
    Auth --> DB
```

## System Architecture Diagram
```mermaid
graph TD
    C[Client Browser] --> F[Next.js Frontend]
    F --> A[App Router]
    A -->|API Calls| B[API Routes]
    B -->|CRUD| D[(Database)]
    B -->|Auth| E[Auth Service]
    E --> D
```

## Database Schema
```mermaid
erDiagram
    User ||--o{ Project : "manages"
    User ||--o{ Task : "assigned"
    Project ||--o{ Task : "contains"
    Task ||--o{ Comment : "has"
    
    User {
        string id
        string email
        string name
        string role
        datetime createdAt
    }
    
    Project {
        string id
        string name
        string description
        datetime deadline
        string status
    }
    
    Task {
        string id
        string title
        string description
        string status
        datetime dueDate
        string priority
    }
```

## Component Architecture
```mermaid
graph TD
    App[App Layout] --> Nav[Navigation]
    App --> Main[Main Content]
    Nav --> Sidebar[Sidebar]
    Nav --> Header[Header]
    Main --> Dashboard[Dashboard]
    Dashboard --> Projects[Projects List]
    Dashboard --> Tasks[Tasks Board]
    Dashboard --> Analytics[Analytics Charts]
```

## Deployment Architecture
```mermaid
graph TD
    subgraph "Production Environment"
        LB[Load Balancer]
        APP1[App Server 1]
        APP2[App Server 2]
        DB[(Primary DB)]
        CACHE[(Redis Cache)]
        
        LB --> APP1
        LB --> APP2
        APP1 --> DB
        APP2 --> DB
        APP1 --> CACHE
        APP2 --> CACHE
    end
```

## Data Flow Diagram
```mermaid
sequenceDiagram
    Client->>+Next.js: HTTP Request
    Next.js->>+Auth: Verify Token
    Auth-->>-Next.js: Valid Token
    Next.js->>+Cache: Check Cache
    Cache-->>-Next.js: Cache Miss
    Next.js->>+Database: Query Data
    Database-->>-Next.js: Return Data
    Next.js->>+Cache: Update Cache
    Next.js-->>-Client: Send Response
```

## State Management Flow
```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Loading: fetchData
    Loading --> Success: dataReceived
    Loading --> Error: errorOccurred
    Success --> Idle: reset
    Error --> Idle: retry
```
