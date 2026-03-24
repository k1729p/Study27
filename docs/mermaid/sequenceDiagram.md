# Create Department Sequence Diagram

Angular application loaded from Node.js dev server and executed in browser.

## 1️⃣ Selected repository: only local web storage

```mermaid
sequenceDiagram
    actor USR as User
    box honeydew Angular Application 'Study27'<br>(runs in web browser)
        participant PAGE as HTML page<br>'Create Department'
        participant FRM as Department<br>Form<br>Component
        participant SRV as Department<br>Service
    end
    box mistyrose Local Data
        participant WST as Web<br>Storage
    end

    autonumber 1
    USR ->>+ PAGE: Click 'Create'
    activate USR
    PAGE ->>+ FRM: On Submit
    FRM ->>+ SRV: Create Department
    SRV ->>+ WST: Add Department<br>(local state)
    WST -->>- SRV: Success
    SRV -->>- FRM: Success
    FRM -->>- PAGE: Success
    PAGE -->>- USR: Redirect to 'Departments'
    deactivate USR
```

## 2️⃣ Selected repository: PostgreSQL database

```mermaid
sequenceDiagram
    actor USR as User
    box honeydew Angular Application 'Study27'<br>(runs in web browser)
        participant PAGE as HTML page<br>Create Department
        participant FRM as Department<br>Form<br>Component
        participant SRV as Department<br>Service
    end
    box mistyrose Local Data
        participant WST as Web<br>Storage
    end
    box cornsilk Backend Repository Server 'Study28'<br>(Express on Node.js)
        participant DC as Department<br>Controller
        participant DS2 as Department<br>Service
        participant DR as PostgreSQL<br>Department<br>Repository
    end
    box bisque Database
        participant PSQL as PostgreSQL
    end
    autonumber 1
    USR ->>+ PAGE: Click 'Create'
    activate USR
    PAGE ->>+ FRM: On Submit
    FRM ->>+ SRV: Create<br>Department
    SRV ->>+ WST: Add Department<br>(local state)
    WST -->>- SRV: Success
    Note over SRV, DC: Communicates with backend via HTTP
    SRV ->>+ DC: Create Department<br>(HTTP POST)
    DC ->>+ DS2: Create<br>Department
    DS2 ->>+ DR: Create<br>Department
    DR ->>+ PSQL: Query
    PSQL -->>- DR: Success
    DR -->>- DS2: Success
    DS2 -->>- DC: Success
    DC -->>- SRV: Success
    SRV -->>- FRM: Success
    FRM -->>- PAGE: Success
    PAGE -->>- USR: Redirect to 'Departments'
    deactivate USR
```
