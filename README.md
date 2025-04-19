# 🚀 DeadlineX – The Smart Team Task Manager

DeadlineX is a full-stack collaborative task management and communication platform built for fast-paced teams. It blends powerful task tracking, real-time notifications, team communication, and user-friendly design to help individuals and teams stay productive, organized, and aligned.

---

## 📌 Features

### 🧠 Smart Dashboard
- Personalized dashboard showing upcoming tasks, task progress, and quick stats.
- Visual task statuses (To-Do, In Progress, Done).
- Priority and due-date markers.

### ✅ Task Management
- Create, assign, edit, and delete tasks.
- Task descriptions, deadlines, priorities, and status tracking.
- View tasks by team or by user.

### 🧑‍🤝‍🧑 Team Collaboration
- Real-time Notifications *(Coming Soon)*
- Get instant updates when tasks are assigned, updated, or nearing deadlines.
- Browser and in-app notifications (WebSocket-based).

---

## 📸 Screenshots

| Dashboard | Task Page | Chat Room |
|----------|-----------|-----------|
| *(Add screenshots here later)* |
- Team creation and management.
- Assign tasks to team members.
- Track team productivity with task insights.

### 💬 Real-time Chat Rooms
- Private, temporary chat rooms for on-the-fly collaboration.
- Invite specific users to chat.
- Chat rooms get auto-deleted when all users leave (ephemeral design).


---

## 📸 Screenshots

| Dashboard | Task Page | Chat Room |
|----------|-----------|-----------|
| *(Add screenshots here later)* |

---

## 🛠 Tech Stack

### Frontend
- **React.js** with functional components & hooks
- **React Router DOM** for page navigation
- **Axios** for API requests
- **Tailwind CSS** for responsive styling
- **Framer Motion** for animation
- **Lucide Icons** and **Shadcn UI** for modern design elements

### Backend
- **Node.js** & **Express.js**
- **MongoDB** with **Mongoose** for data modeling
- **JWT Authentication** for secure logins
- **Socket.IO** for real-time chat & notifications *(ongoing)*
- **RESTful API** structure

---

## Drag-and-Drop Reordering Implementation

This project now supports drag-and-drop reordering of tasks within columns on the Kanban board. The implementation involves the following:

-   When a task is reordered within a column, the frontend sends a PUT request to `/api/tasks/:taskId`.
-   This request includes an `order` parameter in the request body.
-   The `order` parameter is an array of task IDs representing the new order of tasks in that column.
-   The relevant frontend files are `my-app/src/components/organisms/KanbanBoard.jsx` and `my-app/src/redux/slices/tasksSlice.js`.
-   The backend needs to be updated to handle this `order` parameter. It should interpret the array of task IDs and persist the new order of tasks in the database.  A possible implementation would involve updating an `order` or `position` field on each task within the column to reflect its new position in the array.


---

## 📦 Installation & Setup

### 1. Clone the Repository


# Setup Backend

cd server
npm install
# Add your environment variables in .env file
npm run dev


# Setup Frontend

cd client
npm install
npm run dev




---


```markdown
## ⚙️ Upcoming Features
- Real-time Notifications with WebSocket
- Role-based access control (Admin, Member)
- Project Kanban Board View
- Activity Feed and Audit Logs
- Calendar integration
- File Uploads in Tasks & Chat

---

## 🧠 Inspiration
This project was built as a full-stack clone and improvement over tools like:
- Trello
- Asana
- Slack (chat rooms)

With the goal to provide **lightweight**, **self-hosted** team productivity tooling.

---

## 🙌 Contributing
Contributions are welcome! Here's how you can help:
- Report bugs
- Suggest features
- Create pull requests
- Help improve design or UX

---

## 📄 License
This project is open-source and available under the **MIT License**.

---

## 🔗 Connect with the Developer
Made with ❤️ by **Arun Kushwaha**

- GitHub: [@arunkushwaha](https://github.com/arunkushwaha)
- LinkedIn: [Arun Kushwaha](https://www.linkedin.com/in/arun-kushwaha/)
- Portfolio: *Coming soon!*

---

## 🧭 Final Note
Whether you’re a solo freelancer or a startup team, **DeadlineX** aims to give you a flexible and efficient tool to manage your productivity, communication, and collaboration—all in one place.
