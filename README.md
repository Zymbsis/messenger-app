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

### For Development

This method is for developers who want to work on the source code and see live changes. This mode uses `compose.dev.yaml` to build images locally and mount volumes.

**1. Clone the repository**

```bash
git clone <repository-url>
cd messenger-app
```

**2. Run the application**

```bash
docker compose -f compose.dev.yaml up --build -d
```

This will start the application with live-reloading enabled. Changes to the source code in the `backend` or `frontend` directory will be reflected automatically.

### For Deployment

This method runs the pre-built, stable images from Docker Hub. It's the way to run the application on a server or for a clean local test. This mode uses the main `compose.yaml` file.

**1. Get the compose file**

You only need the `compose.yaml` file. You can get it by cloning the repository or downloading it directly.

**2. Run the application**

Make sure you are in the same directory as the `compose.yaml` file and run:

```bash
docker compose up -d
```

Docker will pull the required images from Docker Hub and start the application.

> [!NOTE]
> For both modes, the application requires a running Docker environment. For the first run, it might take some time to download the base images and build the containers.

### Accessing the Application

Once running, the application will be available at:

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
