# EventZen Backend API

EventZen is a backend service for managing events, bookings, and user authentication. This Node.js/Express application provides RESTful API endpoints for event management with JWT authentication.

## Features

- User authentication (register/login) with JWT
- CRUD operations for events
- Booking management system
- Role-based access control
- Error handling middleware
- Database migrations and seeders
- Refresh token implementation

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: MySQL (via Sequelize ORM)
- **Authentication**: JSON Web Tokens (JWT)
- **API Documentation**: (To be added)
- **Environment Management**: dotenv

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/eventzen-backend.git
cd eventzen-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your database credentials and JWT secrets.

4. Database setup:
```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

5. Start the development server:
```bash
npm run dev
```

## Environment Variables

The following environment variables are required:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=eventzen
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=30d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=90d
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - User logout

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event (admin only)
- `GET /api/events/:id` - Get single event
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)

### Bookings
- `GET /api/bookings` - Get all bookings (admin only)
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get single booking
- `DELETE /api/bookings/:id` - Cancel booking

## Database Schema

### Tables
- **Users**: Stores user information and credentials
- **Events**: Contains event details
- **Bookings**: Manages event bookings by users

## Running Tests

To run tests:
```bash
npm test
```

## Deployment

To deploy to production:
```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
