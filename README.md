# 🎓 SkillSwap: Peer-to-Peer Learning Platform

SkillSwap is a MERN stack application designed for students to exchange skills within their campus or community. It connects people who want to learn a specific skill with those who can teach it, fostering a collaborative learning environment.

## 🚀 Key Features

-   **Smart Matching**: Matches users based on their "Skills to Teach" and "Skills to Learn" with a percentage-based compatibility score.
-   **Real-time Chat**: Full-featured chat system powered by Socket.io, including:
    -   Online/Offline presence indicators.
    -   File attachments.
    -   Conversation history.
    -   Unified "Recent Chats" sidebar.
-   **Session Management**:
    -   **Booking**: Request learning sessions directly from chat.
    -   **Host Control**: Teachers can accept/reject requests and create virtual meeting rooms.
    -   **Jitsi Integration**: Automated generation of secure Jitsi Meet links for video sessions.
-   **Comprehensive Profiles**: Users can list skills (with levels), university details, and their weekly availability.
-   **Authentication**: Secure JWT-based auth with Signup, Login, Password Reset, and Google OAuth integration.
-   **Admin Dashboard**: Manage users, monitor stats, and handle reports.
-   **Modern UI**: Responsive design using React, Tailwind CSS, and Lucide icons, featuring Dark/Light mode support.

---

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), Tailwind CSS, React Router, Socket.io-client.
-   **Backend**: Node.js, Express.js.
-   **Database**: MongoDB (Mongoose).
-   **Real-time**: Socket.io.
-   **Video**: Jitsi Meet (Integration).
-   **Storage**: Local uploads (Multer).

---

## 💻 Installation & Setup

### Prerequisites
-   Node.js installed.
-   MongoDB (Local or Atlas) running.

### 1. Backend Setup
1.  Navigate to the server directory: `cd server`
2.  Install dependencies: `npm install`
3.  Create a `.env` file based on `.env.example`:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    CLIENT_URL=http://localhost:5173
    # Optional for OAuth/AI
    GOOGLE_CLIENT_ID=...
    OPENAI_API_KEY=...
    ```
4.  Start the server: `npm run dev`

### 2. Frontend Setup
1.  Navigate to the client directory: `cd client`
2.  Install dependencies: `npm install`
3.  Create a `.env` file:
    ```env
    VITE_API_URL=http://localhost:5000
    ```
4.  Start the client: `npm run dev`

---

## 🔄 User Workflow

1.  **Create Profile**: Sign up and add the skills you can teach and what you want to learn.
2.  **Find Matches**: Browse the "Matches" page to find students with complementary skills.
3.  **Chat & Plan**: Message your match to discuss the learning goals.
4.  **Book Session**: Use the "Book Session" button in the chat to propose a time.
5.  **Learn**: Once the host accepts and creates a meeting, click "Join Meeting" to start the video call.
6.  **Complete**: Mark the session as done after the exchange.

---

## 📂 Project Structure

```text
skillswap/
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── api/        # Axios configuration
│   │   ├── components/ # Shared UI components
│   │   ├── context/    # Auth and Socket contexts
│   │   └── pages/      # Route pages (Chat, Sessions, Profile, etc.)
├── server/              # Node.js backend
│   ├── controllers/    # Business logic
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   ├── sockets/        # Socket.io event handlers
│   └── uploads/        # Local file storage for avatars/chats
```
