# Movie Book Project

This project is a comprehensive exploration of the full-stack development and `DevOps` landscape, through a simple movie recommendation application. At its core, the application leverages existing data to provide personalized movie recommendations to users. The frontend is built using `React` and `TypeScript`. On the backend, the application is powered by multiple services that work in concert to handle authentication, recommendations, caching, and data manipulation, among other functionalities. This architecture not only showcases the integration of various technologies and practices but also provides a practical example of building and deploying a full-fledged application in a modern development environment.

## Showcase



## Project Structure

The project is organized into several directories, each serving a specific purpose in the development and deployment of the application.

### Frontend (`/app`)

The frontend of this project is built using React, TypeScript, and Vite. It utilizes Redux for state management, with `@reduxjs/toolkit` for efficient development practices and `redux-persist` for persisting the state across sessions. The project is styled using Ant Design and styled-components, providing a rich set of UI components and CSS-in-JS styling. Routing is handled by `react-router-dom`.

### Backend (`/server`)

The backend is developed with Flask, a lightweight WSGI web application framework in Python. It uses SQLAlchemy for ORM (Object-Relational Mapping) with a PostgreSQL database. The application's RESTful API serves movie-related data, including CRUD operations and recommendations based on user preferences. Redis is utilized for caching, enhancing performance by storing frequently accessed data.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.