# Task Management Frontend

A modern task management application built with React, TypeScript, and Tailwind CSS. This application allows users to create, manage, and collaborate on tasks within boards.

## Features

- Create and manage multiple boards
- Create, edit, and delete tasks
- Drag-and-drop task management
- Task filtering by status and priority
- User collaboration and permissions
- Real-time updates
- Responsive design

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- React Router
- Context API for state management

## Project Structure

```
src/
├── api/              # API integration layer
│   ├── auth.ts       # Authentication API calls
│   ├── boards.ts     # Board management API calls
│   └── tasks.ts      # Task management API calls
├── components/       # Reusable UI components
│   ├── boards/       # Board-specific components
│   ├── ui/          # Base UI components (buttons, inputs, etc.)
│   ├── task-card.tsx    # Individual task display
│   ├── task-form.tsx    # Task creation/editing form
│   ├── task-list.tsx    # List of tasks
│   └── task-filter.tsx  # Task filtering component
├── contexts/        # React Context providers
│   └── useAuth.ts   # Authentication context
├── hooks/          # Custom React hooks
│   └── use-toast.ts # Toast notification hook
├── lib/            # Utility functions and types
│   └── types.ts    # Shared type definitions
└── pages/          # Page components
    └── Boards.tsx  # Main Board page
    └── Calendar.tsx  # Main Caledar page
    └── Dashboard.tsx  # Main Dashboard page
    └── Login.tsx  # Main Login Page
    └── NotFoundPage.tsx  # Main Notfoud Page
    └── Register.tsx  # Main Register Page
```

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd task-management-front
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Key Components

### TaskForm
- Handles task creation and editing
- Manages form state and validation
- Supports all task properties (title, description, priority, status, dates)

### TaskCard
- Displays individual task information
- Provides task actions (edit, delete, status change)
- Shows task metadata (priority, collaborators, dates)

### TaskList
- Manages a collection of tasks
- Handles task filtering and sorting
- Supports drag-and-drop functionality

### Boards
- Main dashboard view
- Manages board-level operations
- Handles user permissions and collaboration

## API Integration

The application communicates with a backend API through the following services:

- `authApi`: Handles user authentication and user management
- `boardsApi`: Manages board operations (create, update, delete, invite)
- `tasksApi`: Handles task operations (create, update, delete, status changes)

