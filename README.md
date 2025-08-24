# Messenger Application

This is a simple real-time chat application. The project is composed of a web
interface and a backend service. You can register, log in, create chats with
other users, and exchange messages instantly.

## Backend

The backend is built with Python and the FastAPI framework.

- **Real-time communication:** Uses WebSockets to send and receive messages
  instantly.
- **Authentication:** Secure user authentication is handled with JWT (JSON Web
  Tokens).
- **Database:** Uses PostgreSQL to store user and message data.
- **API:** A RESTful API is available for all features.

## Frontend

The frontend is a single-page application (SPA) built with React and TypeScript.

- **UI:** Clean and simple user interface.
- **State Management:** Uses Redux Toolkit for predictable state management.
- **Real-time Updates:** Connects to the backend via WebSockets to show new
  messages immediately.
- **Routing:** Uses React Router for navigation between pages.

## How to Run the Application

You will need Docker and Docker Compose to run this project.

**1. Clone the repository**

First, get the project code on your computer.

```bash
git clone <repository-url>
cd messenger-app
```

**2. Build and run the containers**

This command will build the images for the frontend and backend and start all
the necessary services.

```bash
docker compose up --build -d
```

> [!NOTE]
> The application will work out-of-the-box with default development settings. For production, you should create a `.env` file to set your own secret keys. You can copy the `.env-example` file to get started.


**3. Open the application**

- The **frontend** will be available at
  [http://localhost:5173](http://localhost:5173)
- The **backend** API documentation will be at
  [http://localhost:8000/docs](http://localhost:8000/docs)
