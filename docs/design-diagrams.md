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
## user-flow Diagram
```mermaid
graph TD
    A[User Visits Site] --> B{Authenticated?}
    B -->|No| C[Login/Register Page]
    B -->|Yes| D[Dashboard View]
    
    C --> C1[Login Form]
    C --> C2[Register Form]
    C1 --> C3{Valid Credentials?}
    C3 -->|No| C4[Show Error Message]
    C3 -->|Yes| C5[Set Auth Cookies/Tokens]
    C5 --> D
    C2 --> C6[Create New Account]
    C6 --> C5
    
    D --> D1[View Project Cards]
    D --> D2[View Task Status Charts]
    D --> D3[View Team Performance Metrics]
    D --> D4[Create New Project]
    
    D1 --> E[Project Detail View]
    D4 --> E
    
    E --> E1[View Project Information]
    E --> E2[View Project Tasks]
    E --> E3[Edit Project Details]
    E --> E4[Delete Project]
    E --> E5[Create New Task]
    
    E2 --> F[Kanban Board View]
    F --> F1[View Tasks by Status]
    F --> F2[Drag-and-Drop Task Management]
    F2 --> F3[Update Task Status]
    
    E5 --> G[Task Creation Form]
    G --> G1[Submit New Task]
    G1 --> F
    
    F1 --> H[Task Detail View]
    H --> H1[View Task Information]
    H --> H2[Edit Task Details]
    H --> H3[Delete Task]
    H --> H4[Assign Task to Team Member]
    
    subgraph Role-Based Access Control
      I{User Role?}
      I -->|Admin| J1[Full Access to All Features]
      I -->|Team Member| J2[Limited Project Management Access]
      I -->|Client| J3[View-Only Access to Assigned Projects]
      
      J1 --> K1[Manage All Projects]
      J1 --> K2[Manage All Users]
      J1 --> K3[View All Analytics]
      
      J2 --> L1[Manage Assigned Projects]
      J2 --> L2[Manage Assigned Tasks]
      J2 --> L3[View Team Analytics]
      
      J3 --> M1[View Assigned Projects]
      J3 --> M2[View Project Progress]
      J3 --> M3[Comment on Tasks]
    end
    
    D --> I
    E --> I
    F --> I
    H --> I
```