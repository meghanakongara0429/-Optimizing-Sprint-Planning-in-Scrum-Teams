# Optimizing Sprint Planning in Scrum Teams

This project is a web application designed to help Scrum teams optimize their sprint planning process. It provides tools for managing sprints, daily standups, and Kanban boards, aiming to improve team productivity and collaboration.

## Features
- **Sprint Planner:** Plan and manage sprints, assign tasks, and track progress.
- **Kanban Board:** Visualize tasks in different stages (To Do, In Progress, Done).
- **Daily Standup:** Facilitate daily standup meetings and track blockers.
- **API Integration:** Backend API for managing data and business logic.

## Tech Stack
- **Frontend:** React (JavaScript, CSS)
- **Backend:** Python (Flask or similar)

## Getting Started

### Prerequisites
- Node.js and npm
- Python 3.x

### Installation
1. **Clone the repository:**
   ```sh
   git clone https://github.com/meghanakongara0429/-Optimizing-Sprint-Planning-in-Scrum-Teams.git
   cd -Optimizing-Sprint-Planning-in-Scrum-Teams
   ```
2. **Install frontend dependencies:**
   ```sh
   cd src
   npm install
   ```
3. **Install backend dependencies:**
   ```sh
   pip install -r requirements.txt
   ```

### Running the Application
1. **Start the backend API:**
   ```sh
   python api.py
   ```
2. **Start the frontend:**
   ```sh
   npm start
   ```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:5000` (default ports).

## Project Structure
```
api.py                # Backend API
model.py              # Data models
src/                  # Frontend source code
  components/         # React components
public/               # Static assets
```

## Contributing
See [CONTRIBUTE.md](CONTRIBUTE.md) for guidelines.

## License
This project is licensed under the MIT License.
