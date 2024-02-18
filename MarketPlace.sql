-- Crear la base de datos
CREATE DATABASE market_place;

-- Conectar a la base de datos recién creada
\c market_place;

-- Crear la tabla "usuarios"
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    telefono INTEGER
);

-- Crear la tabla "productos"
CREATE TABLE productos (
    id_producto SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(255),
    descripcion VARCHAR(255),
    precio INTEGER,
    id_usuario INTEGER REFERENCES usuarios(id_usuario),
    url VARCHAR(255)
);

-- Crear la tabla "favoritos"
CREATE TABLE favoritos (
    id_favorito SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id_usuario),
    id_producto INTEGER REFERENCES productos(id_producto)
);