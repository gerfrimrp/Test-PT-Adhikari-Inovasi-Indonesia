CREATE DATABASE IF NOT EXISTS testadv;

CREATE TABLE IF NOT EXISTS "users" (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL unique,
    password VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS "post" (
    post_id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "users"(user_id)
);

