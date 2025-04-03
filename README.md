# EventZen Backend

## Description
EventZen is a backend service for managing events and bookings. It provides functionalities for user authentication, event creation, retrieval, and booking management.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/eventzen-backend.git
   ```
2. Navigate to the project directory:
   ```bash
   cd eventzen-backend
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Usage
1. Create a `.env` file in the root directory and add your environment variables:
   ```
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1h
   ```
2. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- **POST `/auth/register`**: Register a new user.
- **POST `/auth/login`**: Log in an existing user.
- **GET `/auth/profile`**: Retrieve the profile information of the authenticated user.

### Events
- **POST `/events`**: Create a new event (Admin only).
- **GET `/events`**: Retrieve all upcoming events.
- **POST `/events/book`**: Book an event (requires eventId).
- **GET `/events/:eventId/bookings`**: Retrieve all bookings for a specific event (Admin only).

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
