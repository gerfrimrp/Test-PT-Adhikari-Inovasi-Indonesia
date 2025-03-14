# Test-PT-Adhikari-Inovasi-Indonesia API Documentation

## Authentication

### 1. Register a new user
- **Endpoint**: `POST /users/register`
- **Request Body**:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
    }
    ```
- **Response**:
    - **201 Created**: Success, user registered.
    - **400 Bad Request**: Missing required fields or invalid email format.
    - **400 Bad Request**: Email already exists.
    - **500 Internal Server Error**: Server error.

### 2. Log in a user
- **Endpoint**: `POST /users/login`
- **Request Body**:
    ```json
    {
      "email": "john@example.com",
      "password": "password123"
    }
    ```
- **Response**:
    - **200 OK**: Success, returns a JWT token and user information.
    - **400 Bad Request**: Invalid email or password.
    - **500 Internal Server Error**: Server error.

---

## Enrollment

### 1. Add a course for a user
- **Endpoint**: `POST /enrollment`
- **Request Body**:
    ```json
    {
      "user_id": 1,
      "course_id": 101
    }
    ```
- **Headers**: `Authorization: Bearer <your_token>`
- **Response**:
    - **201 Created**: Success, course added to the user's enrollment.
    - **400 Bad Request**: User is already enrolled in this course.
    - **500 Internal Server Error**: Server error.

### 2. Get all enrollments for a user
- **Endpoint**: `GET /enrollment/:user_id`
- **Response**:
    - **200 OK**: Returns the list of courses the user is enrolled in.
    - **500 Internal Server Error**: Server error.

### 3. Remove a course for a user
- **Endpoint**: `DELETE /enrollment`
- **Request Body**:
    ```json
    {
      "user_id": 1,
      "course_id": 101
    }
    ```
- **Headers**: `Authorization: Bearer <your_token>`
- **Response**:
    - **200 OK**: Success, course removed from the user's enrollment.
    - **400 Bad Request**: User is not enrolled in the course.
    - **500 Internal Server Error**: Server error.

### 4. Update the enrollment status for a user
- **Endpoint**: `PUT /enrollment`
- **Request Body**:
    ```json
    {
      "user_id": 1,
      "course_id": 101,
      "status": "in-progress"
    }
    ```
- **Headers**: `Authorization: Bearer <your_token>`
- **Response**:
    - **200 OK**: Success, the enrollment status updated successfully.
    - **400 Bad Request**: Invalid status value or enrollment not found.
    - **500 Internal Server Error**: Server error.

---

## Courses

### 1. Get all courses
- **Endpoint**: `GET /`
- **Response**:
    - **200 OK**: Returns a list of all available courses.

    Example Response:
    ```json
    [
        {
            "course_id": 1,
            "title": "Introduction to Programming",
            "description": "Learn the basics of programming using Python.",
            "course_type": "Programming",
            "instructor_name": "John Doe",
            "course_date": "2025-03-31T17:00:00.000Z"
        },
        {
            "course_id": 2,
            "title": "Creative Marketing Strategies",
            "description": "A course on innovative approaches to marketing using creativity.",
            "course_type": "Marketing",
            "instructor_name": "Jane Smith",
            "course_date": "2025-05-14T17:00:00.000Z"
        }
    ]
    ```

---
