# Smart Home Automation System Backend

This is the backend for the **Smart Home Automation System**, built using **Flask** with support for managing IoT devices, implementing parental control features, and ensuring secure communication protocols. The application includes user authentication with **JWT** (JSON Web Tokens) and a mock API for simulating IoT device management.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Postman Testing](#postman-testing)
- [License](#license)

---

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Python 3.8+
- Flask
- Flask extensions:
  - Flask-JWT-Extended
  - Flask-Bcrypt
  - Flask-SQLAlchemy
  - Flask-Migrate
- SQLite (or any preferred database engine)

### Recommended Tools

- Postman (for API testing)
- Git (for version control)
- Virtual Environment (for Python dependencies)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-home-backend.git
cd smart-home-backend
```

### 2. Create and Activate a Virtual Environment

It's recommended to use a virtual environment to manage dependencies.

#### For Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

#### For Mac/Linux:

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

Install the required dependencies using `pip`:

```bash
pip install -r requirements.txt
```

---

## Database Setup

### 1. Initialize the Database

The application uses **SQLite** as the default database. To set up the database, initialize the database migration repository:

```bash
flask db init
```

### 2. Apply Migrations

Run the following command to create the database tables:

```bash
flask db migrate -m "Initial migration with devices, users, and logs"
flask db upgrade
```

---

## Running the Application

After setting up the environment and database, run the Flask application:

```bash
flask run
```

The server will be running at:

```
http://127.0.0.1:5000/
```

---

## API Endpoints

Below are the main API endpoints available in the backend application:

### Authentication

- **POST `/register`** – Register a new user.
- **POST `/login`** – User login and token generation.
- **POST `/refresh`** – Refresh the access token using the refresh token.
- **DELETE `/logout`** – Log out the user and invalidate the JWT token.

### Device Management

- **POST `/mock/devices`** – Add a mock IoT device (requires authentication).
- **POST `/mock/devices/<int:id>/control`** – Control a specific IoT device (requires authentication).
- **GET `/mock/devices/<int:id>/status`** – Get the status and logs of a specific IoT device (requires authentication).

### Parental Control

- **POST `/parental-control/settings`** – Set parental control settings for a user (requires authentication).
- **GET `/parental-control/settings`** – Get parental control settings for the logged-in user (requires authentication).

---

## Usage

### 1. Register a New User

Use the following payload to register a user at `/register`:

```json
{
  "username": "user1",
  "password": "your_password"
}
```

### 2. Login and Obtain Tokens

Use the following payload to login at `/login`:

```json
{
  "username": "user1",
  "password": "your_password"
}
```

The response will include the **access token** and **refresh token**. Use the access token to authenticate further API requests.

### 3. Add a Mock IoT Device

Use the following payload at `/mock/devices`:

```json
{
  "name": "Smart Thermostat",
  "device_type": "Thermostat"
}
```

### 4. Control a Device

Control a device using the following payload at `/mock/devices/<device_id>/control`:

```json
{
  "action": "turn_on"  // Options: turn_on, turn_off, adjust
}
```

### 5. Set Parental Controls

Set parental control settings at `/parental-control/settings`:

```json
{
  "settings": {
    "content_filtering": "strict",
    "time_limits": "8am-8pm"
  }
}
```

---

## Postman Testing

You can use **Postman** to test all the endpoints.

1. Create a new collection in Postman.
2. Add requests for registration, login, and device management.
3. Use the **access token** obtained from login to test the protected routes (`/mock/devices`, `/parental-control/settings`).

### Bearer Token Authentication

For the protected routes, set the **Authorization** header in Postman as:

```
Bearer <access_token>
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
