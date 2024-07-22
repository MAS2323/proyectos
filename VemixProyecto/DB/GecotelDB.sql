CREATE TABLE Notificaciones (
    notificaciones_id SERIAL PRIMARY KEY,
    remitente VARCHAR(100),
    mensaje VARCHAR(100),
    numero VARCHAR(10),
    cliente_id INT,
    FOREIGN KEY (cliente_id) REFERENCES Clientes(cliente_id)
);
