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

---

## Posts

### 1. Get all posts
- **Endpoint**: `GET /posts`
- **Headers**: `Authorization: Bearer <your_token>`
- **Response**:
    - **200 OK**: Returns a list of posts.

### 2. Create a new post
- **Endpoint**: `POST /posts/create`
- **Request Body**:
    ```json
    {
      "title": "My first post",
      "content": "This is the content of the post"
    }
    ```
- **Headers**: `Authorization: Bearer <your_token>`
- **Response**:
    - **201 Created**: Success, returns the created post.

### 3. Update a post
- **Endpoint**: `PUT /posts/update/{id}`
- **Request Body**:
    ```json
    {
      "title": "Updated title",
      "content": "Updated content"
    }
    ```
- **Headers**: `Authorization: Bearer <your_token>`
- **Response**:
    - **200 OK**: Success, returns the updated post.
    - **400 Bad Request**: Post not found or unauthorized.

### 4. Delete a post
- **Endpoint**: `DELETE /posts/delete/{id}`
- **Headers**: `Authorization: Bearer <your_token>`
- **Response**:
    - **200 OK**: Success, returns the deleted post.
    - **400 Bad Request**: Post not found or unauthorized.

---