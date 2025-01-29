-- Tabla de usuarios
CREATE TABLE usuarios (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(250) NOT NULL UNIQUE,
    contraseña VARCHAR(72) NOT NULL,
    edad INTEGER CHECK (edad >= 0),
    imagen VARCHAR(500)
);

-- Tabla de libros
CREATE TABLE libros (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion VARCHAR(2000),
    precio INTEGER CHECK (precio >= 0),
    cantidad INTEGER CHECK (cantidad >= 0),
    paginas INTEGER CHECK (paginas > 0),
    imagen VARCHAR(500)
);

-- Tabla de carritos
CREATE TABLE carritos (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);

-- Tabla intermedia entre carritos y libros
CREATE TABLE carritos_libros (
    carrito_id INTEGER NOT NULL,
    libro_id INTEGER NOT NULL,
    PRIMARY KEY (carrito_id, libro_id),
    FOREIGN KEY (carrito_id) REFERENCES carritos(id) ON DELETE RESTRICT,
    FOREIGN KEY (libro_id) REFERENCES libros(id) ON DELETE RESTRICT
);

-- Tabla de pedidos
CREATE TABLE pedidos (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    carrito_id INTEGER NOT NULL,
    FOREIGN KEY (carrito_id) REFERENCES carritos(id) ON DELETE RESTRICT
);

-- Tabla de autores
CREATE TABLE autores (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    imagen VARCHAR(500),
    descripcion VARCHAR(1000)
);

-- Tabla intermedia entre libros y autores
CREATE TABLE libros_autores (
    libro_id INTEGER NOT NULL,
    autor_id INTEGER NOT NULL,
    PRIMARY KEY (libro_id, autor_id),
    FOREIGN KEY (libro_id) REFERENCES libros(id) ON DELETE RESTRICT,
    FOREIGN KEY (autor_id) REFERENCES autores(id) ON DELETE RESTRICT
);

-- Tabla de categorías
CREATE TABLE categorias (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    categoria VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla intermedia entre libros y categorías
CREATE TABLE libros_categorias (
    libro_id INTEGER NOT NULL,
    categoria_id INTEGER NOT NULL,
    PRIMARY KEY (libro_id, categoria_id),
    FOREIGN KEY (libro_id) REFERENCES libros(id) ON DELETE RESTRICT,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT
);
