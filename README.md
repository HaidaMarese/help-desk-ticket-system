# IT Help Desk Ticket System

A full-stack IT Help Desk application built with the MERN stack. The application allows employees to create and track IT support tickets, while technicians can assign, manage, prioritize, and resolve support requests through a secure role-based system.

---

## Live Demo

**Frontend (Vercel):**  
https://help-desk-ticket-system-puce.vercel.app/

**Backend API (Render):**  
https://help-desk-ticket-system-cz77.onrender.com/

**GitHub Repository:**  
https://github.com/HaidaMarese/help-desk-ticket-system

---

## Author

**Haida Makouangou**  
B.S. Computer Science (Artificial Intelligence, Gaming, and Robotics)  
University of North Carolina at Charlotte

---

## Features

### Employee

- Register and log in securely
- Create IT support tickets
- View personal tickets
- Track ticket status and priority
- Add comments to tickets
- Delete open tickets

### Technician

- View all employee tickets
- Assign tickets to technicians
- Update ticket status
- Update ticket priority
- Add technician comments
- Delete tickets

---

## Technologies

### Frontend

- React
- React Router
- Axios
- Vite
- CSS3

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- bcryptjs

---

## Security

- Password hashing with bcryptjs
- JWT authentication
- Protected API routes
- Role-based authorization
- Environment variables for sensitive configuration

---

## Local Setup

Clone the repository:

```bash
git clone https://github.com/HaidaMarese/help-desk-ticket-system.git
cd help-desk-ticket-system
```

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

Create `.env` files for both the **server** and **client** using your own environment variables.

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend:

```bash
cd client
npm run dev
```

---

## API Endpoints

### Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Tickets

```text
GET     /api/tickets
POST    /api/tickets
GET     /api/tickets/:id
PUT     /api/tickets/:id
DELETE  /api/tickets/:id
POST    /api/tickets/:id/comments
```

---

## Future Improvements

- Email notifications
- File attachments
- Search and filtering
- Ticket analytics dashboard
- Admin dashboard
- Reporting and metrics

---

## Project Status

Completed as a full-stack portfolio project demonstrating:

- React application development
- REST API development with Express.js
- MongoDB database design with Mongoose
- JWT authentication and authorization
- Role-based access control
- CRUD operations
- Responsive user interface
- Full-stack MERN architecture
- Cloud deployment with Vercel and Render

---

## Screenshots

### Register Page

!<img width="2812" height="1534" alt="image" src="https://github.com/user-attachments/assets/1b1adb44-31da-4e2d-9579-b1075256f3da" />



---

### Employee Dashboard

!<img width="2780" height="1530" alt="image" src="https://github.com/user-attachments/assets/0fae98f3-2bc5-4295-81ba-00b1b2678b66" />


---

---

### Create Ticket

!<img width="2844" height="1534" alt="image" src="https://github.com/user-attachments/assets/2d860510-244f-41a5-9e5d-da309f62c139" />


---

## License

MIT License
