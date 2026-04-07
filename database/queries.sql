-- ============================================================
-- SECCIÓN 3: BASE DE DATOS
-- Diseño de tablas y consultas requeridas
-- ============================================================

-- Tabla: users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Tabla: tasks (con soporte para Soft Delete)
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    deletedAt TIMESTAMP NULL DEFAULT NULL,
    userId INT,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- CONSULTAS REQUERIDAS
-- ============================================================

-- 1. Obtener todas las tareas de un usuario específico (excluyendo eliminadas)
SELECT t.id, t.title, t.completed
FROM tasks t
INNER JOIN users u ON t.userId = u.id
WHERE u.id = 1
  AND t.deletedAt IS NULL;

-- 2. Contar tareas completadas por usuario
SELECT u.id, u.name, COUNT(t.id) AS tareas_completadas
FROM users u
LEFT JOIN tasks t ON t.userId = u.id
  AND t.completed = TRUE
  AND t.deletedAt IS NULL
GROUP BY u.id, u.name;
