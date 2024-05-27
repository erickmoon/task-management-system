## Task Management System Implementation

### Overview
The task management system is a web application that allows users to log tasks and send notifications via email to the complainant. It also provides a means to manage SMTP settings for sending emails. The system is built using React for the frontend and Node.js with Express for the backend. Microsoft SQL Server is used for the database.

### Step-by-Step Implementation

1. **Setting Up the Environment**
   - Installed Node.js and npm on the system.
   - Created a new project directory and initialized a Node.js project using `npm init`.
   - Installed necessary packages including Express, Sequelize, Nodemailer, and CORS for the backend, and React for the frontend.

2. **Database Configuration**
   - Installed Microsoft SQL Server and set up a new database named `task_management`.
   - Created a user `admin` with the password `pass` and granted necessary privileges.
   - Used Sequelize, a promise-based Node.js ORM, to define models for `Task` and `SMTPSettings`.

3. **Backend Implementation**
   - **Server Setup**: Configured an Express server to handle API requests.
   - **Task Model**: Defined a `Task` model with fields for issue, category, assignee, complainant email, tracking number, and timestamps.
   - **SMTPSettings Model**: Defined an `SMTPSettings` model to store SMTP server details.
   - **Routes**:
     - `POST /tasks`: Logs a new task and sends an email to the complainant.
     - `GET /tasks`: Retrieves all logged tasks.
     - `DELETE /tasks/:id`: Deletes a specific task.
     - `GET /smtp-settings`: Retrieves current SMTP settings.
     - `POST /smtp-settings`: Saves or updates SMTP settings.

4. **Frontend Implementation**
   - **React Components**: Created React components for logging tasks and managing SMTP settings.
   - **Axios for API Calls**: Used Axios for making HTTP requests to the backend.
   - **Styling**: Used CSS for styling the components and ensuring responsiveness.
   - **State Management**: Used React's `useState` and `useEffect` hooks to manage state and side effects, such as fetching data from the backend.
   - **Task Logging Form**: Included fields for issue, category (with dropdown), assignee, and complainant email.
   - **SMTP Settings Form**: Included fields for host, port, user, and password.
   - **Task List**: Displayed a table of logged tasks with options to filter by category and date range, and delete tasks.
   - **Notifications**: Displayed success or error messages upon task logging and SMTP settings update.

5. **SMTP Settings Management**
   - Provided a form to save SMTP settings for sending emails.
   - Ensured that the settings are saved to the database and used during task logging to send emails to complainants.

### How the System Works

1. **Logging a Task**
   - User fills out the task form and submits it.
   - A POST request is made to the backend API (`/tasks`).
   - Backend saves the task in the database and retrieves SMTP settings.
   - An email is sent to the complainant using the configured SMTP settings.
   - The frontend displays a success message with the tracking number.

2. **Managing SMTP Settings**
   - User fills out the SMTP settings form and submits it.
   - A POST request is made to the backend API (`/smtp-settings`).
   - Backend saves or updates the SMTP settings in the database.
   - The frontend displays a success message indicating that the settings have been saved.

3. **Viewing and Filtering Tasks**
   - Tasks are fetched from the backend API (`/tasks`) and displayed in a table.
   - Users can filter tasks by category and date range using the provided filters.
   - Users can delete tasks, which sends a DELETE request to the backend API and refreshes the task list.

### Technologies Used
- **Frontend**: React, Axios, CSS
- **Backend**: Node.js, Express, Sequelize, Nodemailer
- **Database**: Microsoft SQL Server

### Installation and Running the System
1. **Backend Setup**
   - Navigate to the `server` directory and install dependencies using `npm install`.
   - Run the server using `node index.js`.

2. **Frontend Setup**
   - Navigate to the `client` directory and install dependencies using `npm install`.
   - Start the React app using `npm start`.
