# BlogPost

## 📌 Overview

Blog Post is a full-stack web application where users can create and manage posts, as well as comment on posts made by others. The platform supports user authentication, ensuring that only registered users can create, edit, and delete their own posts and comments. It is built with a focus on simplicity, performance, and ease of use.

### 🔹 Key Features

- **User Authentication**: Secure login and registration using JWT.
- **Create & Manage Posts**: Users can create, edit, and delete their own posts.
- **Commenting System**: Users can comment on posts and engage in discussions.
- **Responsive UI**: Fully responsive design with Tailwind CSS.
- **Optimized Performance**: Built with modern frameworks for efficiency and scalability.

---

## 🌐 Live Demo

Check out the live demo: [Live Demo](https://blog-post-bice.vercel.app/)

---

## 🛠 Tech Stack

### Frontend

- React.js (TypeScript)
- Redux toolkit
- Tailwind CSS

### Backend

- Express.js (TypeScript)
- PostgreSQL (TypeORM/Prisma)
- JWT Authentication

---

## 🚀 Installation & Setup

Follow these steps to run the project locally:

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/your-username/blog-post.git
cd blog-post
```

### 2️⃣ Install Backend Dependencies

```sh
npm install
```

### 3️⃣ Set Up Database

- Create a new PostgreSQL database.
- Update `.env` file using `.env.example` as a reference.

### 4️⃣ Run Database Migrations

```sh
npm run db:migrate
```

### 5️⃣ Start Backend Server

```sh
npm run dev
```

### 6️⃣ Set Up Frontend

```sh
cd client
npm install
npm start
```

The application should now be running locally! 🎉

---

## 📄 API Endpoints (Basic Overview)

| Method | Endpoint              | Description               |
| ------ | --------------------- | ------------------------- |
| POST   | `/signup`             | Register a new user       |
| POST   | `/login`              | Login and receive a token |
| POST   | `/logout`             | logout                    |
| POST   | `/auth`               | To get the user data      |
| GET    | `/posts`              | Fetch all posts           |
| POST   | `/posts`              | Create a new post         |
| GET    | `/posts/:id`          | Fetch a single post       |
| DELETE | `/posts/:id`          | Delete a post             |
| PUT    | `/posts/:id`          | Update a post             |
| GET    | `/comments/:postId`   | Fetch post comments       |
| POST   | `/comments/:postId`   | Create comment for a post |
| PUT    | `/comments/:commentId`| Update a comment          |
| DELETE | `/comments/:commentId`| Delete a comment          |

For a complete list of API endpoints, refer to the API documentation.

## 📧 Contact

For any questions or feedback, feel free to reach out:

- GitHub: [Bas-Shiekh](https://github.com/Bas-Shiekh)
- Email: [basilelshakhe@gmail.com](mailto\:basilelshakhe@gmail.com)
