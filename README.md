# Student Management App

A React + TypeScript frontend for managing student enrollment requests — approve or reject pending applications, and view the approved student list.

---

## Project Structure

```
test-pjt/
├── index.html
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx                          # App entry point
    ├── App.tsx                           # Root component
    ├── index.css
    │
    ├── types/
    │   └── student.ts                    # ApprovedStudent, PendingStudent interfaces
    │
    ├── api/
    │   ├── mockApi.ts                    # Simulated async API (students, students/requests)
    │   └── mockApi.test.ts
    │
    ├── data/
    │   ├── mockApprovedStudents.ts       # Seed data — approved
    │   ├── mockApprovedStudents.test.ts
    │   ├── mockPendingStudents.ts        # Seed data — pending
    │   └── mockPendingStudents.test.ts
    │
    ├── hooks/
    │   └── useStudentManagement.ts       # State + business logic (fetch, approve, reject)
    │
    ├── containers/
    │   ├── StudentListContainer.tsx      # Page-level composition layer
    │   ├── StudentListContainer.css
    │   └── StudentListContainer.test.tsx
    │
    ├── components/
    │   ├── StudentList.tsx               # Renders pending + approved sections
    │   ├── StudentList.css
    │   ├── StudentList.test.tsx
    │   ├── SummaryCard.tsx               # Clickable stat badge (Total / Approved / Pending)
    │   ├── SummaryCard.css
    │   ├── SummaryCard.test.tsx
    │   ├── DataTable.tsx                 # Generic sortable, filterable, paginated table
    │   ├── DataTable.css
    │   └── DataTable.test.tsx
    │
    └── test/
        └── setup.ts                      # Vitest + Testing Library global setup
```

---

## Architecture Diagram

```mermaid
graph TD
    subgraph Entry
        A[main.tsx] --> B[App.tsx]
    end

    subgraph Container["Container Layer"]
        B --> C[StudentListContainer]
    end

    subgraph Hook["Custom Hook"]
        C -->|calls| D[useStudentManagement]
        D -->|fetches| E[mockApi]
        E -->|reads| F[(mockApprovedStudents)]
        E -->|reads| G[(mockPendingStudents)]
        D -->|manages state| D
    end

    subgraph Presentation["Presentation Layer"]
        C -->|renders| H[SummaryCard x3]
        C -->|renders| I[StudentList]
        I -->|renders| J[DataTable — Pending]
        I -->|renders| K[DataTable — Approved]
    end

    subgraph Types
        L[student.ts\nApprovedStudent\nPendingStudent]
    end

    D -.->|types| L
    I -.->|types| L
```

---

## Data Flow

```mermaid
sequenceDiagram
    participant UI as StudentListContainer
    participant Hook as useStudentManagement
    participant API as mockApi

    UI->>Hook: mount
    Hook->>API: apiRequest('students')
    Hook->>API: apiRequest('students/requests')
    API-->>Hook: ApprovedStudent[]
    API-->>Hook: PendingStudent[]
    Hook-->>UI: state (data / loading / error)

    Note over UI: User clicks Approve
    UI->>Hook: handleApprove(pendingStudent)
    Hook-->>Hook: move to approvedStudents, remove from pending
    Hook-->>UI: updated state → re-render
```

---

## Component Responsibilities

| Layer | File | Responsibility |
|-------|------|----------------|
| Hook | `useStudentManagement` | All state: fetch, approve, reject logic |
| Container | `StudentListContainer` | Layout composition, scroll navigation |
| Component | `StudentList` | Section layout, loading/error states |
| Component | `SummaryCard` | Stat display, optional scroll-to click |
| Component | `DataTable` | Generic table: sort, filter, paginate |
| API | `mockApi` | Simulated network with typed overloads |
| Types | `student.ts` | `ApprovedStudent`, `PendingStudent` shapes |

---

## Running the App

```bash
npm install
npm run dev
```

## Running Tests

```bash
npm test
```
